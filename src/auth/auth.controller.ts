import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/models/User.models';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body() dto: RegisterDto,
  ): Promise<{ user: User; accessToken: string; expiresin: string }> {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
  ): Promise<{ user: User; accessToken: string; expiresin: string }> {
    return this.authService.login(dto);
  }
}
