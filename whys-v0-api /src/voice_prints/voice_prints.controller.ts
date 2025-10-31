import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { VoiceprintsService, VoiceGuest } from './voice_prints.service';

@Controller('voiceprints')
export class VoiceprintsController {
  constructor(private readonly service: VoiceprintsService) {}

  // GET /voiceprints/guests?userId=<uuid>
  @Get('guests')
  async listGuests(@Query('userId') userId: string): Promise<VoiceGuest[]> {
    if (!userId) throw new BadRequestException('userId is required');
    return this.service.listGuests(userId);
  }
}
