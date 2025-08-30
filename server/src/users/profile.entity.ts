// src/users/profile.entity.ts
import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: 'user.png' })
  avatarUrl: string;

  @Column({ length: 255, default: 'cover.jpg' })
  coverUrl: string;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })  
  user: User;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
