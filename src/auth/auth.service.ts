import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { addSeconds, format } from 'date-fns';
import * as crypto from 'crypto';

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
  async signup(dto: RegisterDto): Promise<{ message: string }> {
    const { email, password } = dto;

    const isExists = await this.user.findOne({
      where: { email },
    });

    if (isExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // confirmed token email
    let code = Math.floor(10000 + Math.random() * 90000);
    const exiredDate = new Date(new Date().getTime() + 1 * 60000);

    // hash password
    const hash = await bcrypt.hash(password, 12);

    const user = await this.user.create({
      email,
      password: hash,
      confirmedToken: code,
      expiredConfiremdToken: exiredDate,
    });

    await this.mailService.sendConfirmationEmail(user, code, user.id);

    return {
      message: 'Please check email for actived your account',
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

    if (!user || user.isActived === 'Pending') {
      throw new HttpException(
        'Email not registered or Please actived your account',
        HttpStatus.BAD_REQUEST,
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    const { accessToken, expiresin } = this.generateAccessToken(
      user.id,
      user.role,
    );

    return {
      user,
      accessToken,
      expiresin,
    };
  }

  // @Desc    : Verify your email
  // @Routes  : POST api/auth/verify/:id
  // @Access  : Private
  async verifyEmail(id: any, token: any) {
    console.log({ id, token });
    const user = await this.user.findOne({
      where: { id },
    });

    if (!user || !user.confirmedToken === token) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    await this.user.update(
      {
        isActived: 'Actived',
        confirmedToken: null,
        expiredConfiremdToken: null,
      },
      { where: { id } },
    );

    await this.mailService.sendConfirmedEmail(user);

    return user;
  }

  // @Desc  : Generate access token
  generateAccessToken(userId: string, role: string) {
    const { JWT_EXPIRE_IN } = process.env;
    const expiresin = format(
      addSeconds(new Date(), parseInt(JWT_EXPIRE_IN, 10) / 1000),
      'yyyy-MM-dd HH:mm:ss',
    );
    const accessToken = this.jwtService.sign({ userId, role });
    return {
      accessToken,
      expiresin,
    };
  }
}
