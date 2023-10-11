import { IsString } from '@nestjs/class-validator';
import { Base } from 'src/interface/base';

export class sendMessageDto extends Base {
  @IsString()
  from: String;

  @IsString()
  to: String;

  @IsString()
  content: String;
}
