import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Profile) private readonly profilesRepo: Repository<Profile>,
        ) {}

    async create(dto: CreateUserDto): Promise<User> {

        const errors: Record<string, string[]> = {};

            if (await this.usersRepository.exists({ where: { email: dto.email } })) {
                errors.email = ['Email is already taken'];
            }

            if (
                dto.contactNumber &&
                (await this.usersRepository.exists({ where: { contactNumber: dto.contactNumber } }))
            ) {
                errors.contactNumber = ['Contact number is already taken'];
            }

            if (Object.keys(errors).length) {
                throw new ConflictException({
                message: 'User already exists',
                code: 'USER_UNIQUE_CONSTRAINT',
                errors,
                });
            }
        try{

            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const user = this.usersRepository.create({...dto, password: hashedPassword});
            const savedUser = await this.usersRepository.save(user);
            if(savedUser){
                const profile = this.profilesRepo.create({user : savedUser, avatarUrl: 'user.png'});
                    await this.profilesRepo.save(profile);
            }
            return savedUser;

        }catch(e){

            if (e?.code === 'ER_DUP_ENTRY') {
            const msg: string = e.sqlMessage || e.message || '';
            const fieldErrors: Record<string, string[]> = {};
            if (msg.includes('UQ_users_email')) {
                fieldErrors.email = ['Email is already taken'];
            }
            if (msg.includes('UQ_users_contactNumber')) {
                fieldErrors.contactNumber = ['Contact number is already taken'];
            }
            throw new ConflictException({
                message: 'User already exists',
                code: 'USER_UNIQUE_CONSTRAINT',
                errors: Object.keys(fieldErrors).length
                ? fieldErrors
                : { _generic: ['Unique constraint violation'] },
            });
            }
            throw e;
        }
    }

    async findByEmailWithPassword(email: string) {
        return this.usersRepository
            .createQueryBuilder('u')
            .addSelect('u.password')
            .where('u.email = :email', { email })
            .leftJoinAndSelect('u.profile', 'profile')
            .getOne();
    }

    async myProfile(id: number) {
        const data = await this.usersRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!data) {
            return null;
        }
        return data;
    }

    async updateProfile(id: number, updateData: any) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user) {
            return null;
        }

        if (updateData.firstName) user.firstName = updateData.firstName;
        if (updateData.lastName) user.lastName = updateData.lastName;
        if (updateData.email) user.email = updateData.email;
        if (updateData.contactNumber) user.contactNumber = updateData.contactNumber;
        
        if (updateData.password) {
            user.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await this.usersRepository.save(user);
        return updatedUser;
    }

    async updateAvatar(id: number, avatarUrl: string) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user || !user.profile) {
            return null;
        }

        user.profile.avatarUrl = avatarUrl;
        await this.profilesRepo.save(user.profile);
        
        return user;
    }

    async updateCover(id: number, coverUrl: string) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user || !user.profile) {
            return null;
        }

        user.profile.coverUrl = coverUrl;
        await this.profilesRepo.save(user.profile);
        
        return user;
    }

    async updatePassword(id: number, password: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            return {
                status: false,
                data: [],
                message: 'User not found'
            };
        }
        user.password = await bcrypt.hash(password, 10);
        await this.usersRepository.save(user);
        return {
            status: true,
            data: user,
            message: 'Password updated successfully'
        };
    }

}
