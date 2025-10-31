// FILE: src/sessions/sessions.module.ts
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService], // optional, only if other modules need it
})
export class SessionsModule {}
