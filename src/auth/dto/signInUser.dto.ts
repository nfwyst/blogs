import { IsString, MaxLength } from 'class-validator'

export class SignInUserDto {
  @IsString()
  @MaxLength(32)
  email: string;

  @IsString()
  password: string;
}
