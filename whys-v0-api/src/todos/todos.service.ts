import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class TodosService {
  constructor(private readonly db: DbService) {}

  async listByUser(userId: string) {
    if (!userId) throw new BadRequestException('userId is required');

    const { rows } = await this.db.query(
      `SELECT t.id, t.session_id, t.task, t.due_at, t.created_at, t.owner, t.speaker_label
    FROM todos t
    JOIN sessions s ON t.session_id = s.id
    WHERE s.user_id = $1
    ORDER BY t.created_at DESC`,
      [userId],
    );
    return rows;
  }

  async create(userId: string, task: string, dueAt?: string) {
    if (!task) throw new BadRequestException('task is required');

    const { rows } = await this.db.query(
      `INSERT INTO todos (id, owner, task, due_at, created_at, session_id)
       VALUES (gen_random_uuid(), $1, $2, $3, now(), null)
       RETURNING *`,
      [userId, task, dueAt ?? null],
    );
    return rows[0];
  }

  async delete(todoId: string, userId: string) {
    const { rowCount } = await this.db.query(
      `DELETE FROM todos WHERE id = $1 AND owner = $2`,
      [todoId, userId],
    );
    return { success: (rowCount ?? 0) > 0 };
  }
}
