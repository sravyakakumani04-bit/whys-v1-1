import { Module } from '@nestjs/common';
import { ActionItemsController } from './action-items.controller';
import { ActionItemsService } from './action-items.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ActionItemsController],
  providers: [ActionItemsService],
})
export class ActionItemsModule {}
