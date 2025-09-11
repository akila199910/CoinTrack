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
    @Query('period') period?: string,
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string
  ): Promise<Response> {
    try {
      const userId = req.user.sub;

      let start: Date | undefined;
      let end: Date | undefined;
      let selectedPeriod = 'today';

      if (period && ['today', 'week', 'month', 'year'].includes(period)) {
        const dateRange = this.dashboardService.getDateRange(period as 'today' | 'week' | 'month' | 'year');
        start = dateRange.startDate;
        end = dateRange.endDate;
        selectedPeriod = period;
      }

      else if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
        
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        selectedPeriod = 'custom';
        
      } 
      else {
        const dateRange = this.dashboardService.getDateRange('today');
        start = dateRange.startDate;
        end = dateRange.endDate;
        selectedPeriod = 'today';
      }

      const data = await this.dashboardService.getTransactionsData(userId, start, end);
      
      return res.status(HttpStatus.OK).json({
        status: true,
        data: {
          ...data,
          period: selectedPeriod,
          dateRange: { startDate: start, endDate: end }
        },
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
