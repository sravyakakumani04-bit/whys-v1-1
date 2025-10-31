import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { LookupUserDto } from './users.dto';
import { UserRow } from './users.repo';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // CHECK-ONLY lookup (replaces old dev-login behavior)
  @Post('dev-login') // you can also rename to 'lookup'
  async devLogin(@Body() dto: LookupUserDto) {
    let user: UserRow | null = null;

    if (dto.email) {
      user = await this.users.findByEmail(dto.email);
    } else if (dto.name) {
      user = await this.users.findByName(dto.name);
    } else {
      throw new NotFoundException('User does not exist');
    }

    if (!user) throw new NotFoundException('User does not exist');

    // Return same shape your frontend expects
    return { user };
  }

  // still useful for debugging
  @Get('me')
  async me(@Query('id') id: string) {
    const user = await this.users.findById(id);
    return { user };
  }
}
