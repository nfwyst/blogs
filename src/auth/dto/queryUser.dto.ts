import { IsOptional, IsNumber, IsString, MaxLength } from 'class-validator'

export class QueryUserDto {
  @IsString()
  @MaxLength(32)
  @IsOptional()
  username?: string;

  @IsNumber()
  @IsOptional()
  _id?: number;

  @IsString()
  @MaxLength(32)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(32)
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  profile?: string;

  @IsString()
  @IsOptional()
  hashedPassword?: string;

  @IsNumber()
  @IsOptional()
  salt?: Number;

  @IsString()
  @IsOptional()
  about?: string;

  @IsNumber()
  @IsOptional()
  role?: Number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  resetPasswordLink?: string
}
