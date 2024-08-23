import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Users } from 'src/users/users.schema';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokensDto> {
    try {
      const { email, password } = loginDto;

      const user = await this.usersModel.findOne({ email }).exec();

      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      return this.createTokens(user.id);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async refreshAccessToken(id: string): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(
      { sub: id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '10m',
      },
    );

    return { accessToken };
  }

  private async createTokens(id: string): Promise<TokensDto> {
    const accessToken = await this.jwtService.signAsync(
      { sub: id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '10m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '60m',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
