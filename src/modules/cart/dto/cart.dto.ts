import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"
import { Type } from 'class-transformer';


export class createCartDTO {

    @IsNotEmpty()
    @IsString()
    productId: string

    @Type(() => Number)
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    quantity: number


}


export class RemoveCartDTO {
    @IsNotEmpty()
    @IsString()
    productId: string
}


export class DeleteCartDTO {
    @IsNotEmpty()
    @IsString()
    cartId: string
}

export class UpdateCartDTO {
    @IsNotEmpty()
    @IsString()
    productId: string

    @Type(() => Number)
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    quantity: number
}