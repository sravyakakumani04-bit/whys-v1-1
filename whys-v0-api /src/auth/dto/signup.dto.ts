import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsString() @Length(1, 50)
  @Transform(({ value }) => String(value ?? '').trim())
  firstName!: string;

  @IsString() @Length(1, 50)
  @Transform(({ value }) => String(value ?? '').trim())
  lastName!: string;

  // letters, numbers, underscores, dots; 3–20 chars
  @IsString()
  @Matches(/^[a-zA-Z0-9._]{3,20}$/, { message: 'Username must be 3 to 20 chars (letters, numbers, ., _).' })
  @Transform(({ value }) => String(value ?? '').trim())
  username!: string;

  @IsEmail()
  @Transform(({ value }) => String(value ?? '').trim().toLowerCase())
  email!: string;

  @IsString() @MinLength(8)
  password!: string;
}
