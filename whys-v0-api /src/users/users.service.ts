import { Injectable } from '@nestjs/common';
import { UsersRepo, UserRow } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepo) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    return this.repo.findByEmail(email.trim().toLowerCase());
  }

  async findByName(name: string): Promise<UserRow | null> {
    return this.repo.findByName(name.trim());
  }

  async findById(id: string): Promise<UserRow | null> {
    return this.repo.findById(id);
  }
}
