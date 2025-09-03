// src/users/user.entity.ts (add inverse side)
import { OneToOne, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Category } from 'src/category/entities/category.entity';

export enum Role { ADMIN = 'ADMIN', CLIENT = 'CLIENT' }

@Entity('users')
@Index('UQ_users_email', ['email'], { unique: true })
@Index('UQ_users_contactNumber', ['contactNumber'], { unique: true })
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 15 }) 
  firstName: string;

  @Column({ length: 15 }) 
  lastName: string;

  @Column({ length: 32 }) 
  name: string;

  @Column() 
  email: string;

  @Column({ length: 15}) 
  contactNumber?: string;

  @Column({ select: false }) 
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT }) 
  role: Role;

  @Column({ default: true }) 
  active: boolean;

  @OneToOne(() => Profile, profile => profile.user, { cascade: ['insert'] })
  profile?: Profile;

  @OneToMany(() => Category, (category) => category.user)
    categories: Category[]

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
