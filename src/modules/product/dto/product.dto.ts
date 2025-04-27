import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, isNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength, Validate } from "class-validator"
import { Types } from "mongoose"


export class CreateProductDto {

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    name: string

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    category: Types.ObjectId

    // @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    subCategory: Types.ObjectId

    // @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    brand: Types.ObjectId


    @IsOptional()
    mainImage: object


    @IsOptional()
    @IsArray()
    subImages: object[]

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    price: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    subPrice: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    discount: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    stock: number


    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @Type(() => Number)
    @IsNotEmpty()
    rateNumber: number

    @Type(() => Number)
    @IsNotEmpty()
    rateAvg: number

}




export class UpdateProductDto {


    @IsString()
    @MinLength(2)
    @IsOptional()
    name: string

    @IsString()
    @MinLength(2)
    @IsOptional()
    description: string

    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    category: Types.ObjectId

    // @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    subCategory: Types.ObjectId

    // @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    brand: Types.ObjectId


    @IsOptional()
    mainImage: object


    @IsOptional()
    @IsArray()
    subImages: object[]

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    price: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    subPrice: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    discount: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    stock: number


    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    quantity: number

    @Type(() => Number)
    @IsOptional()
    rateNumber: number

    @Type(() => Number)
    @IsOptional()
    rateAvg: number


}


export class QueryDTO {
    @IsString()
    @IsOptional()
    name?: string

    @IsOptional()
    @IsString()
    sort?: string

    @IsOptional()
    @IsString()
    select?: string

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @IsPositive()
    page?: number
}

