import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TransactionService {

  constructor( @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    try {

      const category = await this.categoryRepository.findOne({ where: { id: createTransactionDto.category_id } });

      if(!category) {
        return {
          status: false,
          data: [],
          message: 'Category not found'
        }
      }

      if(category.status === false) {
        return {
          status: false,
          data: [],
          message: 'Category is not active'
        }
      }

      const transaction = await this.transactionRepository.create({
        ...createTransactionDto,
        category: { id: category.id },
        user: { id: userId }
      });
      const savedTransaction = await this.transactionRepository.save(transaction);

      return {
        status: true,
        data: savedTransaction,
        message: 'Transaction created successfully'
      }
    } catch (error) {

      return {
        status: false,
        errors: error,
        data: [],
        message: 'Transaction creation failed'
      }
      
    }
  }

  async findAll(userId: number) {
    const transactions = await this.transactionRepository.find({ 
      where: { user: { id: userId } },
      select: ['id', 'amount', 'date', 'description', 'status', 'category'],
      relations: ['category']

    });
    return {
      status: true,
      data: transactions,
      message: 'Transactions fetched successfully'
    };
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({ where: { id: id },
      select: ['id', 'amount', 'date', 'description', 'status', 'category'],
      relations: ['category']
     });

     if(!transaction) {
      return {
        status: false,
        data: [],
        message: 'Transaction not found'
      };
     }
     return {
      status: true,
      data: transaction,
      message: 'Transaction fetched successfully'
     };
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionRepository.update(id, updateTransactionDto);
  }

  remove(id: number) {
    return this.transactionRepository.delete(id);
  }
}
