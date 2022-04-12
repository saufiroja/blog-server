import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '../models/User.models';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private user: typeof User) {}

  // @Desc    : Signup new user
  // @Route   : POST api/auth/signup
  // @Access  : Public
  async signup(dto: AuthDto): Promise<{ user: User }> {
    try {
      const { email, password } = dto;

      const isExists = await this.user.findOne({
        where: {
          email,
        },
      });

      if (isExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const hash = await bcrypt.hash(password, 12);

      const user = await this.user.create({
        email,
        password: hash,
      });

      return { user };
    } catch (error) {
      console.log(error);
    }
  }

  // @Desc    : Login user
  // @Route   : POST api/auth/login
  // @Access  : Public
  async login(dto: AuthDto): Promise<{ user: User }> {
    const { email, password } = dto;
    const user = await this.user.findOne({
      where: {
        email,
      },
    });

    if (!email) {
      throw new HttpException(
        'Invalid email or email not registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    return { user };
  }
}
