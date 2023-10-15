import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Auth } from './auth.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      signInDto.rememberMe || false,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getUser(@Auth() user: User) {
    return user;
  }
}
