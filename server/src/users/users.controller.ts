import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.create(dto);
    }
}

