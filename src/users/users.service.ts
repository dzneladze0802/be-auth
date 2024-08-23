import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Users } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  public async createUser(userDto: CreateUserDto): Promise<{
    statusCode: HttpStatus;
    message: string;
  }> {
    try {
      const isUserExists = await this.checkIfUserExists(userDto?.email);

      if (isUserExists) {
        throw new NotFoundException('User already registered with this email.');
      }

      const createdUser = new this.usersModel({
        ...userDto,
        password: await bcrypt.hash(userDto?.password, 10),
      });
      await createdUser.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(
    id: string,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    try {
      const user = await this.usersModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.usersModel.deleteOne({ _id: id }).exec();

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    try {
      const user = await this.usersModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.password = await bcrypt.hash(updatePasswordDto.password, 10);
      await user.save();

      return {
        statusCode: HttpStatus.OK,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.usersModel.findOne({ email }).exec();

    if (user) {
      return true;
    }

    return false;
  }
}
