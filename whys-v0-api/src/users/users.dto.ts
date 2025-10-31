import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LookupUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
