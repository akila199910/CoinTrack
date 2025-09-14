import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository, Between } from 'typeorm';

export enum Type { INCOME = 'INCOME', EXPENSE = 'EXPENSE', SAVINGS = 'SAVINGS' }

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    ) {}

    parseYMDToLocalDate(s: string): Date {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, m - 1, d, 0, 0, 0, 0);
      }
      
      startOfDayLocal(d: Date) {
        const copy = new Date(d);
        copy.setHours(0, 0, 0, 0);
        return copy;
      }
      
      endOfDayLocal(d: Date) {
        const copy = new Date(d);
        copy.setHours(23, 59, 59, 999);
        return copy;
      }
    async getTransactionsData(userId: number, fromDate?: string, toDate?: string) {
        let start: Date;
        let end: Date;

        if (fromDate && !toDate) {
            const s = this.parseYMDToLocalDate(fromDate);
            start = this.startOfDayLocal(s);
            end = this.endOfDayLocal(s);
          } else if (fromDate && toDate) {
            const s = this.parseYMDToLocalDate(fromDate);
            const e = this.parseYMDToLocalDate(toDate);
            if (s > e) [start, end] = [this.startOfDayLocal(e), this.endOfDayLocal(s)];
            else { start = this.startOfDayLocal(s); end = this.endOfDayLocal(e); }
          } else {
            const today = new Date();
            start = this.startOfDayLocal(today);
            end = this.endOfDayLocal(today);
          }
   

        const whereCondition = {
                user: { id: userId },
                date: Between(start, end)
            } 

        const transactionsArray = await this.transactionRepository.find({
            where: { ...whereCondition },
            relations: ['category']
        });
        const graphData = await this.getGraphData(userId);
        // Separate income, expense and savings transactions
        const incomeTransactions = transactionsArray.filter(transaction => transaction.category.type === Type.INCOME);
        const expenseTransactions = transactionsArray.filter(transaction => transaction.category.type === Type.EXPENSE);
        const savingsTransactions = transactionsArray.filter(transaction => transaction.category.type === Type.SAVINGS);

        // Group income by category and sum amounts
        const incomeByCategory = incomeTransactions.reduce((acc, transaction) => {
            const incomeId = transaction.category.id;
            const incomeName = transaction.category.name;
            
            if (!acc[incomeId]) {
                acc[incomeId] = {
                    income_id: incomeId,
                    income_name: incomeName,
                    total_amount: 0,
                    transaction_count: 0,
                };
            }
            
            acc[incomeId].total_amount += parseFloat(transaction.amount);
            acc[incomeId].transaction_count += 1;
            
            return acc;
        }, {} as Record<number, any>);

        // Group expense by category and sum amounts
        const expenseByCategory = expenseTransactions.reduce((acc, transaction) => {
            const expenseId = transaction.category.id;
            const expenseName = transaction.category.name;
            
            if (!acc[expenseId]) {
                acc[expenseId] = {
                    expense_id: expenseId,
                    expense_name: expenseName,
                    total_amount: 0,
                    transaction_count: 0,
                };
            }
            
            acc[expenseId].total_amount += parseFloat(transaction.amount);
            acc[expenseId].transaction_count += 1;
            
            return acc;
        }, {} as Record<number, any>);

        const savingsByCategory = savingsTransactions.reduce((acc, transaction) => {
            const savingsId = transaction.category.id;
            const savingsName = transaction.category.name;
            
            if (!acc[savingsId]) {
                acc[savingsId] = {
                    savings_id: savingsId,
                    savings_name: savingsName,
                    total_amount: 0,
                    transaction_count: 0,
                };
            }
            acc[savingsId].total_amount +=parseFloat(transaction.amount);
            acc[savingsId].transaction_count += 1;
            return acc;
        }, {} as Record<number, any>);

        // Convert objects to arrays for chart data
        const incomeChartData = Object.values(incomeByCategory);
        const expenseChartData = Object.values(expenseByCategory);
        const savingsChartData = Object.values(savingsByCategory);
        // Calculate totals
        const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        const totalExpense = expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        const totalSavings = savingsTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        const balance = totalIncome - totalExpense;

        return {
            income: incomeChartData,
            expense: expenseChartData,
            savings: savingsChartData,
            totalIncome,
            totalExpense,
            totalSavings,
            balance,
            transactionCount: incomeTransactions.length + expenseTransactions.length + savingsTransactions.length,
            graphData
        };
        
    }

    async getGraphData(userId: number) {
        const allTransactions = await this.transactionRepository.find({
            where: { user: { id: userId } },
            relations: ['category']
        });

        const incomeGraphData = Array(12).fill(0);
        const expenseGraphData = Array(12).fill(0);
        const savingsGraphData = Array(12).fill(0);

        allTransactions.forEach(transaction => {
            const month = new Date(transaction.date).getMonth();
            if(transaction.category.type === Type.INCOME){
                incomeGraphData[month] += parseFloat(transaction.amount);
            }else if(transaction.category.type === Type.EXPENSE){
                expenseGraphData[month] += parseFloat(transaction.amount);
            }else if(transaction.category.type === Type.SAVINGS){
                savingsGraphData[month] += parseFloat(transaction.amount);
            }
        });

        return {
            incomeGraphData,
            expenseGraphData,
            savingsGraphData
        };
    }
}
