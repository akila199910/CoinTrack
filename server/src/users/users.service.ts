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
                              console.log(dto);  


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

}
