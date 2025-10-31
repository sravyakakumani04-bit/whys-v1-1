import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, BadRequestException,NotFoundException,HttpCode,
} from '@nestjs/common';
import { ActionItemsService } from './action-items.service';

@Controller('action-items')
export class ActionItemsController {
  constructor(private readonly service: ActionItemsService) {}

  // GET /action-items?userId=...
  @Get()
  list(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.service.list(userId);
  }

  // POST /action-items?userId=...
  @Post()
  async create(@Query('userId') userId: string, @Body() body: any) {
    if (!userId) throw new BadRequestException('userId is required');
    if (!body || typeof body.action !== 'string' || !body.action.trim()) {
      throw new BadRequestException('action (string) is required');
    }

    // inline defaults/coercions
    const category = (body.category ?? '').toString().trim() ;
    const dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (dueDate && isNaN(dueDate.getTime())) throw new BadRequestException('Invalid dueDate');
    const completed = Boolean(body.completed);

    return this.service.create(userId, {
      action: body.action.trim(),
      category,
      dueDate: dueDate ? dueDate.toISOString() : null,
      completed,
    });
  }

 // PATCH /action-items/:id/toggle?userId=...
@Patch(':id/toggle')
@HttpCode(204)
async toggle(@Param('id') id: string, @Query('userId') userId: string) {
  if (!userId) throw new BadRequestException('userId is required');
  if (!id) throw new BadRequestException('id is required');

  const updated = await this.service.toggle(id, userId);
  if (!updated) throw new NotFoundException('Action item not found');
  
}


  // DELETE /action-items/:id?userId=...
  @Delete(':id')
  delete(@Param('id') id: string, @Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    if (!id) throw new BadRequestException('id is required');
    return this.service.delete(id, userId);
  }
}
