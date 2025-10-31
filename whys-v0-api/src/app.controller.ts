import { Controller, Get } from '@nestjs/common';
import { DbService } from './db/db.service';

@Controller()
export class AppController {
  constructor(private readonly db: DbService) {}

  @Get('health')
  health() {
    return { ok: true, service: 'whys-v0-api', time: new Date().toISOString() };
  }
  
  @Get('db/health')
  async dbHealth() {
    const r = await this.db.query<{ now: string }>('select now() as now');
    return { ok: true, now: r.rows[0].now };
  }
}
