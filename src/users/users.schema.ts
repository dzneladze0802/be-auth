import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users extends CreateUserDto {}

export const UsersSchema = SchemaFactory.createForClass(Users);
