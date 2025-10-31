import { Controller, Get } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DbService) {}

  @Get()
  liveness() {
    return {
      ok: true,
      service: process.env.npm_package_name ?? 'whys-v0-api',
      time: new Date().toISOString(),
      env: process.env.NODE_ENV ?? 'development',
    };
  }

  @Get('version')
  version() {
    return {
      name: process.env.npm_package_name ?? 'whys-v0-api',
      version: process.env.npm_package_version ?? '0.0.0',
      node: process.version,
      env: process.env.NODE_ENV ?? 'development',
      buildTime: process.env.BUILD_TIME ?? null,
    };
  }

  @Get('db')
  async db() {
    // If DbService is not configured, this will throw; wrap to return a clean result.
    try {
      const r = await this.database.query<{ now: string }>('select now() as now');
      return { ok: true, now: r.rows[0].now };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'DB check failed' };
    }
  }
}
