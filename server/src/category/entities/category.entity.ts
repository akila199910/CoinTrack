import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "src/transaction/entities/transaction.entity";
export enum Type { INCOME = 'INCOME', EXPENSE = 'EXPENSE' }
@Entity('categories')
export class Category {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 15 })
    name: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column({ default: true })
    status: boolean;

    @Column({ type: 'enum', enum: Type })
    type: Type;

    @Column({ length: 255, default: 'category.png' })
    image: string;

    @ManyToOne(() => User, (user) => user.categories)
    user: User;

    @OneToMany(() => Transaction, (transaction) => transaction.category)
    transactions: Transaction[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
