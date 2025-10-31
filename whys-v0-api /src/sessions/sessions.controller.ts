// src/sessions/sessions.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':id')
  async getSession(@Param('id') id: string) {
    console.log(`GET /sessions/${id}`);
    const result = await this.sessionsService.findById(id);

    const seg = (result as any).segments;
    const segCount = Array.isArray(seg) ? seg.length : 0;

    console.log('sessions result:', {
      transcript: !!result.transcript,
      summaryLen: result.summary?.length ?? 0,
      todos: result.to_do?.length ?? 0,
      segments: segCount,                 // should now always print
      segmentsType: typeof seg,     
      blindspots:result.blindspots?.length??0  ,   // helpful for debugging
    });

    return result;
  }
}
