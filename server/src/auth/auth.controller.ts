import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    try {
      const data = await this.authService.login(dto.email, dto.password, res);
      return res.status(200).json({
        status: true,
        data,
        message: 'Login successful'
      });
    } catch (error) {
      return res.status(401).json({
        status: false,
        data: [],
        message: 'Invalid credentials'
      });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    this.authService.logout(res);
    return res.status(200).json({
      status: true,
      data: [],
      message: 'Logged out successfully'
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any, @Res() res: Response) {
    const userData = { id: req.user.sub, role: req.user.role, name: req.user.name };
    return res.status(200).json({
      status: true,
      data: userData,
      message: 'User data retrieved successfully'
    });
  }
}
