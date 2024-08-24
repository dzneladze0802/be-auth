import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Patch,
  Get,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Request() req: any) {
    return await this.usersService.deleteUser(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  async get(@Request() req: any) {
    return await this.usersService.getUserInfo(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  async updatePassword(@Body() body: UpdatePasswordDto, @Request() req: any) {
    return await this.usersService.updatePassword(req.user.sub, body);
  }
}
