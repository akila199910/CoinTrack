import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Type } from "../entities/category.entity";

export class CreateCategoryDto {

    @IsNotEmpty() @IsString() @Length(1, 15) 
    name: string;

    @IsOptional() @IsString() @Length(1, 255) 
    description: string;

    @IsOptional() @IsBoolean()  
    status: boolean;

    @IsNotEmpty() @IsEnum(Type)
    type: Type;

    // image: File;
}
