import { IsEmail, IsString } from '@nestjs/class-validator';
import { Base } from 'src/interface/base';

export class CreateUserDto extends Base {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  status: string;
}
