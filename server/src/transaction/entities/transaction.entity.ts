import { Category } from "src/category/entities/category.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity('transactions')
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
    amount!: string;
  
    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    date: Date;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column({ default: true })
    status: boolean;

    @ManyToOne(() => Category, (category) => category.transactions, {
        nullable: false,               
        onDelete: 'RESTRICT',          
      })
      @JoinColumn({ name: 'category_id' })
      category: Category;
      
      
      @ManyToOne(() => User, (user) => user.transactions, {
        nullable: false,
        onDelete: 'CASCADE',
      })
      @JoinColumn({ name: 'user_id' })
      user: User;
      

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
