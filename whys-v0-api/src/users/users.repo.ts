import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

export type UserRow = {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class UsersRepo {
  constructor(private readonly db: DbService) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await this.db.query<UserRow>(
      'SELECT * FROM public.users WHERE lower(email) = lower($1)',
      [email],
    );
    return rows[0] ?? null;
  }

  async findByName(name: string): Promise<UserRow | null> {
    const { rows } = await this.db.query<UserRow>(
      'SELECT * FROM public.users WHERE name = $1',
      [name],
    );
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<UserRow | null> {
    const { rows } = await this.db.query<UserRow>(
      'SELECT * FROM public.users WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }
}
