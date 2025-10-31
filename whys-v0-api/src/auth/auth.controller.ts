import { Body, ConflictException, Controller, Post, Get, Query, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const user = await this.auth.signup(dto);
    // For now, just return user profile (no tokens yet)
    return { user };
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    if (!username?.trim()) {
      return { available: null }; // invalid input, treat as not available
    }

    const available = await this.auth.isUsernameAvailable(username);
    return { available };
  }

  @Post('signin')
  async signIn(@Body() body: { identifier: string; password: string }) {
    return this.auth.signIn(body.identifier, body.password);
  }


}
