import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, ValidationPipe, UsePipes, HttpStatus, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: any, @Res() res: Response) {
    try {
    const userId = req.user.sub;
    const transaction = await this.transactionService.create(createTransactionDto, userId);
    if(transaction.status) {
      return res.status(HttpStatus.CREATED).json({
        status: transaction.status,
        data: transaction.data,
        message: transaction.message
      });
    }
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: transaction.status,
      data: transaction.data,
      errors: transaction.errors,
      message: transaction.message
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

  @Get()
  @UseGuards(JwtAuthGuard)  
  async findAll(@Req() req: any, @Res() res: Response) {
    try {
      const userId = req.user.sub;
      const { transactions, categories } = await this.transactionService.findAll(+userId);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: { transactions, categories },
        message: 'Transactions fetched successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        message: 'Internal server error'
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const transaction = await this.transactionService.findOne(+id);
      
      if(!transaction.status) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          data: [],
          message: transaction.message
        });
      }
      return res.status(HttpStatus.OK).json({
        status: true,
        data: transaction.data,
        message: 'Transaction fetched successfully'
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: any, @Res() res: Response) {
    try {
      const transaction = await this.transactionService.update(+id, updateTransactionDto);
      if(!transaction.status) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          data: [],
          message: transaction.message
        });
      }
      return res.status(HttpStatus.OK).json({
        status: true,
        data: transaction.data,
        message: transaction.message
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        error:error,
        message: 'Internal server error'
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
