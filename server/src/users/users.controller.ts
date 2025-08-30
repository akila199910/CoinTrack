import { Body, Controller, Get, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe, UseGuards, HttpException, ConflictException } from '@nestjs/common';
import type { Response } from 'express';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Body() dto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.usersService.create(dto);
            return res.status(HttpStatus.CREATED).json({
                status: true,
                data: user,
                message: 'User created successfully'
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                return res.status(HttpStatus.CONFLICT).json({
                    status: false,
                    data: [],
                    message: error.message
                });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: [],
                message: 'Internal server error'
            });
        }
    }

    @Get('my-profile')
    @UseGuards(JwtAuthGuard)    
    async myProfile(@Req() req: any, @Res() res: Response) {
        try {
            const data = await this.usersService.myProfile(req.user.sub);

            if (!data) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    status: false,
                    data: [],
                    message: 'Profile not found'
                });
            }
            return res.status(HttpStatus.OK).json({
                status: true,
                data,
                message: 'Profile fetched successfully'
            });
        } catch (error) {
            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: [],
                message: 'Internal server error'
            });
        }
    }
}

