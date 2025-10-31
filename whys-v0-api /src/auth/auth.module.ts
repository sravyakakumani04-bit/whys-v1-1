import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from '../db/db.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [DbModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '15m' },
    }),
  ], 
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
