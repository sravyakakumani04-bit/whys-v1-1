import { Body, Controller, Post } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post('init')
  async init(@Body() body: { userId: string; contentType: string; durationMs?: number }) {
    console.log("INIT called with:", body);
    const result = await this.service.initUpload(body.userId, body.contentType, body.durationMs);
    console.log("INIT result:", result);
    return result;
  }

  @Post('complete')
  async complete(@Body() b: { userId: string; key: string; size?: number }) {
    console.log("CONFIRM called with:", b);
    const result = await this.service.confirmAndQueue(b.userId, b.key, b.size);
  //  return this.service.confirmAndQueue(b.userId, b.key, b.size);
    console.log("CONFIRM result:", result);
    return result;
  }
}
