import { Controller, Get, HttpStatus, Req, Res, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Req() req: any, 
    @Res() res: Response, 
    @Query('fromDate') fromDate?: string, 
    @Query('toDate') toDate?: string
  ): Promise<Response> {
    try {
      const userId = req.user.sub;

      const data = await this.dashboardService.getTransactionsData(userId, fromDate, toDate);
      
      return res.status(HttpStatus.OK).json({
        status: true,
        data: data,
        message: 'Dashboard fetched successfully'
      });
      
    } catch (error) {

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        errors: error,
        message: 'Internal server error'
      });
    }
  }
}
