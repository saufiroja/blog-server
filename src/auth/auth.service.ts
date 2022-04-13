import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { addSeconds, format } from 'date-fns';

import { MailService } from '../mail/mail.service';
import { User } from '../models/User.models';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private user: typeof User,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  // @Desc    : Signup new user
  // @Route   : POST api/auth/signup
  // @Access  : Public
  async signup(
    dto: RegisterDto,
  ): Promise<{ user: User; accessToken: string; expiresin: string }> {
    const { email, password } = dto;

    const isExists = await this.user.findOne({
      where: {
        email,
      },
    });

    if (isExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    let code = Math.floor(10000 + Math.random() * 90000);
    const hash = await bcrypt.hash(password, 12);

    const user = await this.user.create({
      email,
      password: hash,
      confirmedToken: code,
    });

    const { accessToken, expiresin } = this.generateAccessToken(user.id);

    await this.mailService.sendConfirmationEmail(user, code);

    return {
      user,
      accessToken,
      expiresin,
    };
  }

  // @Desc    : Login user
  // @Route   : POST api/auth/login
  // @Access  : Public
  async login(
    dto: LoginDto,
  ): Promise<{ user: User; accessToken: string; expiresin: string }> {
    const { email, password } = dto;
    const user = await this.user.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid email or email not registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    const { accessToken, expiresin } = this.generateAccessToken(user.id);

    return {
      user,
      accessToken,
      expiresin,
    };
  }

  // @Desc  : Generate access token
  generateAccessToken(userId: string) {
    const { JWT_EXPIRE_IN } = process.env;
    const expiresin = format(
      addSeconds(new Date(), parseInt(JWT_EXPIRE_IN, 10) / 1000),
      'yyyy-MM-dd HH:mm:ss',
    );
    const accessToken = this.jwtService.sign({ userId });
    return {
      accessToken,
      expiresin,
    };
  }
}
