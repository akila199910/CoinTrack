import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction,User,Category])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
