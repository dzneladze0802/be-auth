import { Prop } from '@nestjs/mongoose';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @Prop({ required: true })
  @IsString()
  @MinLength(8)
  password: string;
}
