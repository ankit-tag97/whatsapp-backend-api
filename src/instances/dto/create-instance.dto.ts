import { IsString } from '@nestjs/class-validator';
import { Base } from 'src/interface/base';

export class CreateInstanceDto extends Base {
  @IsString()
  user_id: string;

  @IsString()
  client: string;
}
