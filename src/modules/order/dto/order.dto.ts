import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethodsTypes } from "src/common/types/types";

export class CreateOrderDTO {

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsEnum(PaymentMethodsTypes)
    @IsNotEmpty()
    paymentMethod: string

}