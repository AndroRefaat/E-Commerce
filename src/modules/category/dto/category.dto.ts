import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    name: string
}


export class UpdateCategoryDTO {
    @IsString()
    @IsOptional()
    name: string
}