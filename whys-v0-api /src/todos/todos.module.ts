import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
