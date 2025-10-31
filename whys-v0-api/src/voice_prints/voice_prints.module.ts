import { Module } from '@nestjs/common';
import { VoiceprintsController } from './voice_prints.controller';
import { VoiceprintsService } from './voice_prints.service';
import { DbService } from '../db/db.service'; // or import DbModule if you have one

@Module({
  controllers: [VoiceprintsController],
  providers: [VoiceprintsService, DbService],
  exports: [VoiceprintsService],
})
export class VoiceprintsModule {}
