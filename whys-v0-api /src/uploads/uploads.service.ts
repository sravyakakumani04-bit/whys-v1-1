import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UploadsRepo } from './uploads.repo';
import * as crypto from 'crypto';
import { QueueService, IngestJob } from '../queue/queue.service';


@Injectable()
export class UploadsService {
  private s3 = new S3Client({ region: process.env.AWS_REGION });

  constructor(
    private readonly repo: UploadsRepo,
    private readonly queue: QueueService
  ) {}

  private generateKey(userId: string, sessionId: string) {
    const iso = new Date().toISOString().replace(/[:.]/g, '-');
    
    const y = iso.slice(0, 4), m = iso.slice(5, 7), d = iso.slice(8, 10);
    return `users/${userId}/raw/${y}/${m}/${d}/${iso}-${sessionId}.m4a`;
  }

  async initUpload(userId: string, contentType: string, durationMs?: number) {
    const sessionId = crypto.randomUUID();
    const key = this.generateKey(userId,sessionId);
    await this.repo.createPending(userId, key, contentType, sessionId, durationMs);


    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType,
     // ACL: 'private',
    });
    const uploadUrl = await getSignedUrl(this.s3, cmd, { expiresIn: 900 });

    return { uploadUrl, key, contentType, method: "PUT" as const , sessionId  };
  }

  async confirmAndQueue(userId: string, key: string, sizeBytes?: number) {
    // 1) ensure object exists in S3
    await this.s3.send(new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
    }));

    // 2) mark DB as uploaded
    const row = await this.repo.markUploaded(key, sizeBytes);
    if (!row) throw new Error('File row not found for key');

    // 3) push job to Redis list
    const job: IngestJob = {
      job_id: crypto.randomUUID(),
      file_id: row.id,
      user_id: userId,
      s3_key: key,
      session_id:row.session_id,
      content_type: row.content_type,
      created_at: new Date().toISOString(),
    };
    await this.queue.addIngest(job);

    // 4) (optional) mark status='queued'
    if ((this.repo as any).markQueued) {
      await (this.repo as any).markQueued(key);
    }

    return { ok: true, fileId: row.id, jobId: job.job_id };
  }
}
