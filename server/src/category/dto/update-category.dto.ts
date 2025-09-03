import { IsBoolean, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Type } from "../entities/category.entity";

export class UpdateCategoryDto {
    @IsOptional() @IsString() @Length(1, 15) 
    name?: string;

    @IsOptional() @IsString() @Length(1, 255) 
    description?: string;

    @IsOptional() @IsBoolean()  
    status?: boolean;

    @IsOptional() @IsEnum(Type)
    type?: Type;

}
