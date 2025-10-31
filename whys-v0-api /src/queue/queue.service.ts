import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export type IngestJob = {
  job_id: string;
  file_id: string;
  user_id: string;
  s3_key: string;
  session_id: string;
  content_type?: string;
  created_at: string;
};

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly redis = new Redis(process.env.REDIS_URL!);
  private readonly listKey = process.env.INGEST_LIST_KEY || 'whys:jobs';

  async addIngest(job: IngestJob) {
    await this.redis.lpush(this.listKey, JSON.stringify(job));
  }

  async onModuleDestroy() {
    await this.redis.quit().catch(() => {});
  }
}
