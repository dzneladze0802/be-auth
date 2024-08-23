import { Prop } from '@nestjs/mongoose';
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  IsEmail,
  IsEnum,
  Max,
} from 'class-validator';
import { GenderEnum } from 'src/constants';
export class CreateUserDto {
  @Prop({ required: true })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @Prop({ required: true })
  @IsInt()
  @Min(18)
  @Max(90)
  age: number;

  @Prop({ required: true })
  @IsString()
  @MinLength(8)
  password: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  @IsEnum(GenderEnum)
  gender: GenderEnum;
}
