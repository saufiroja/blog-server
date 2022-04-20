import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { addDays, addSeconds, format } from 'date-fns';

import { UserRefreshToken } from '../models/UserRefreshToken.models';
import { MailService } from '../mail/mail.service';
import { User } from '../models/User.models';
import { LoginDto, RegisterDto } from './dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private user: typeof User,
    @InjectModel(UserRefreshToken)
    private userRefreshToken: typeof UserRefreshToken,
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

    // hash password and hash code otp
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
  async login(dto: LoginDto): Promise<{
    user: User;
    accessToken: string;
    expiresin: string;
    refreshToken: string;
  }> {
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
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      expiresin,
      refreshToken: refreshToken.refreshToken,
    };
  }

  // @Desc    : Verify your email
  // @Routes  : POST api/auth/verify/:id
  // @Access  : Private
  async verifyEmail(id: any, token: any) {
    const user = await this.user.findOne({
      where: { id },
    });

    if (!user || !user.confirmedToken === token) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    if (user.expiredConfiremdToken < Date.now()) {
      throw new HttpException('otp expired', HttpStatus.FORBIDDEN);
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

  // @Desc    : Resend your code
  // @Routes  : GET api/auth/resend/:id
  // @Access  : Private
  async resend(id: any): Promise<{ message: string }> {
    const user = await this.user.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    // confirmed token email
    let code = Math.floor(10000 + Math.random() * 90000);
    const exiredDate = new Date(new Date().getTime() + 1 * 60000);

    await this.user.update(
      { confirmedToken: code, expiredConfiremdToken: exiredDate },
      { where: { id } },
    );

    await this.mailService.resendConfirmationEmail(user, code);

    return { message: 'Please, check your email to get the latest code' };
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

  async generateRefreshToken(userId: string): Promise<UserRefreshToken> {
    const refreshToken = `${userId}.${randomBytes(40).toString('hex')}`;
    return await this.userRefreshToken.create({
      refreshToken,
      userId,
      expiredAt: addDays(new Date(), 7),
    });
  }
}
