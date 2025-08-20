import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {
  @IsString() @Length(1, 15) 
  firstName: string;

  @IsString() @Length(1, 15) 
  lastName: string;

  @IsNotEmpty() @IsString() @Length(1, 30) 
  name: string;

  @IsEmail() 
  email: string;

  @IsOptional() @IsString() @Length(0, 15) 
  contactNumber?: string;

  @IsNotEmpty() @IsString() @Length(8, 20) 
  password: string;

  @IsOptional() @IsEnum(Role) 
  role?: Role;

  @IsOptional() 
  active?: boolean;
}
