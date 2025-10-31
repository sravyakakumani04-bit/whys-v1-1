import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // GET /todos?userId=...
  @Get()
  async listByUser(@Query('userId') userId: string) {
    return this.todosService.listByUser(userId);
  }

  // POST /todos
  @Post()
  async create(@Body() body: { userId: string; task: string; dueAt?: string }) {
    return this.todosService.create(body.userId, body.task, body.dueAt);
  }

  // DELETE /todos/:id?userId=...
  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    return this.todosService.delete(id, userId);
  }
}
