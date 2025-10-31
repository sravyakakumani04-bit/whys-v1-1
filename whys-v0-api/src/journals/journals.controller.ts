import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly service: JournalsService) {}

  // GET /journals/sections?userId=...
  @Get('sections')
  async getSections(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.service.listSections(userId);
  }
}
