// src/uploads/uploads.repo.ts
import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UploadsRepo {
  constructor(private readonly db: DbService) {}

  async createPending(
    userId: string,
    key: string,
    contentType: string,
    sessionId: string,
    durationMs?: number,
  ) {
    // 1. Ensure session exists first
    await this.db.query(
      `
      INSERT INTO sessions (id, user_id, title, started_at, status, created_at, kind)
      VALUES ($1, $2, $3, now(), 'uploading', now(), 'batch')
      ON CONFLICT (id) DO NOTHING
      `,
      [sessionId, userId, 'Session'],
    );

    // 2. Insert file row
    const q = `
      INSERT INTO files (user_id, s3_key, content_type, session_id, duration_ms, status)
      VALUES ($1, $2, $3, $4, $5 , 'pending')
      RETURNING *`;
    const { rows } = await this.db.query(q, [
      userId,
      key,
      contentType,
      sessionId,
      durationMs ?? null,
    ]);
    return rows[0];
  }

  async markUploaded(key: string, sizeBytes?: number) {
    const q = `
      UPDATE files
         SET status = 'uploaded', size_bytes = COALESCE($2, size_bytes)
       WHERE s3_key = $1
       RETURNING *`;
    const { rows } = await this.db.query(q, [key, sizeBytes ?? null]);
    return rows[0];
  }
}
