import { IsOptional, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MaxLength(32)
  @IsOptional()
  username?: string;

  @IsString()
  @MaxLength(32)
  name: string;

  @IsString()
  @MaxLength(32)
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  profile?: string;

  @IsString()
  @IsOptional()
  hashedPassword: string;

  @IsNumber()
  @IsOptional()
  salt: Number;

  @IsString()
  @IsOptional()
  about: string;

  @IsNumber()
  @IsOptional()
  role: Number;

  @IsString()
  @IsOptional()
  photo: string;

  @IsString()
  @IsOptional()
  resetPasswordLink: string
}
