import { Exclude, Type } from '@nestjs/class-transformer';
import { IsDate, IsOptional } from '@nestjs/class-validator';

export class Base {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Exclude()
  updatedAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt: Date;
}
