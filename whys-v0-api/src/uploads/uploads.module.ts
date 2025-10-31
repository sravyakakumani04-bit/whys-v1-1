import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UploadsRepo } from './uploads.repo';
import { DbModule } from '../db/db.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [DbModule, QueueModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsRepo],
})
export class UploadsModule {}
