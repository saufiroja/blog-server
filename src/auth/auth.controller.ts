import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from '../models/User.models';
import { AuthService } from './auth.service';
import { GetUser, Roles } from './decorator';
import { RegisterDto, LoginDto } from './dto';
import { JwtGuard } from './guard';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
  ): Promise<{ user: User; accessToken: string; expiresin: string }> {
    return this.authService.login(dto);
  }

  @Post('verify/:id')
  verifyEmail(@Param('id') id: any, @Body() token: string) {
    return this.authService.verifyEmail(id, token);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Get('/admin')
  getAdmin(@Req() req: Request) {
    return 'hello admin';
  }
}
