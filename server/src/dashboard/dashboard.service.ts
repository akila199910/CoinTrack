import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository, Between } from 'typeorm';

export enum Type { INCOME = 'INCOME', EXPENSE = 'EXPENSE' }

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) {}

    async getTransactionsData(userId: number, startDate?: Date, endDate?: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const start = startDate || today;
        const end = endDate || new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);

        const whereCondition = {
            user: { id: userId },
            date: Between(start, end)
        };

        const transactionsArray = await this.transactionRepository.find({
            where: { ...whereCondition },
            relations: ['category']
        });

        // Separate income and expense transactions
        const incomeTransactions = transactionsArray.filter(transaction => transaction.category.type === Type.INCOME);
        const expenseTransactions = transactionsArray.filter(transaction => transaction.category.type === Type.EXPENSE);

        // Group income by category and sum amounts
        const incomeByCategory = incomeTransactions.reduce((acc, transaction) => {
            const incomeId = transaction.category.id;
            const incomeName = transaction.category.name;
            
            if (!acc[incomeId]) {
                acc[incomeId] = {
                    income_id: incomeId,
                    income_name: incomeName,
                    total_amount: 0,
                    transaction_count: 0
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
                    transaction_count: 0
                };
            }
            
            acc[expenseId].total_amount += parseFloat(transaction.amount);
            acc[expenseId].transaction_count += 1;
            
            return acc;
        }, {} as Record<number, any>);

        // Convert objects to arrays for chart data
        const incomeChartData = Object.values(incomeByCategory);
        const expenseChartData = Object.values(expenseByCategory);

        // Calculate totals
        const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        const totalExpense = expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        const balance = totalIncome - totalExpense;

        return {
            income: incomeChartData,
            expense: expenseChartData,
            totalIncome,
            totalExpense,
            balance,
            transactionCount: incomeTransactions.length + expenseTransactions.length
        };
        
    }
    getDateRange(period: 'today' | 'week' | 'month' | 'year') {
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        switch (period) {
            case 'today':
                return {
                    startDate: today,
                    endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
                };
            
            case 'week':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                console.log(startOfWeek);
                return {
                    startDate: startOfWeek,
                    endDate: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
                };
            
            case 'month':
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                console.log(startOfMonth, endOfMonth);
                return {
                    startDate: startOfMonth,
                    endDate: endOfMonth
                };
            
            case 'year':
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
                return {
                    startDate: startOfYear,
                    endDate: endOfYear
                };
            
            default:
                return this.getDateRange('today');
        }
    }
}
