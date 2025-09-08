import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateTransactionDto {

    @IsNotEmpty() @IsString() @Length(1, 15) 
    amount: string;

    @IsOptional() @IsString() @Length(1, 255) 
    description: string;

    @IsNotEmpty() @IsDateString()
    date: string;

    @IsOptional() @IsBoolean()
    status: boolean;

    @IsNotEmpty() @IsNumber()
    category_id: number;
    
}
