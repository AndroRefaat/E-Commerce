import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { Types } from "mongoose";
import { OrderStatusTypes, PaymentMethodsTypes } from "src/common/types/types";
import { Order } from "src/DB/models/order.model";


registerEnumType(PaymentMethodsTypes, {
    name: "PaymentMethodsTypes",
})

registerEnumType(OrderStatusTypes, {
    name: "OrderStatusTypes",
})


@ObjectType()
export class CartProductsObjectType {

    @Field(() => ID, { nullable: false })
    _id: Types.ObjectId;

    @Field(() => ID, { nullable: false })
    productId: Types.ObjectId | undefined

    @Field(() => Number, { nullable: false })
    quantity: number;

    @Field(() => Number, { nullable: false })
    finalPrice: number;
}

@ObjectType()
export class CartObjectType {

    @Field(() => ID, { nullable: false })
    _id: Types.ObjectId;

    @Field(() => [CartProductsObjectType], { nullable: false })
    products: CartProductsObjectType[];

    @Field(() => Number, { nullable: false })
    subTotal: number;
}



@ObjectType()
export class OrderObject implements Partial<Order> {

    @Field(() => ID, { nullable: false })
    _id: Types.ObjectId;

    @Field(() => CartObjectType, { nullable: false })
    cartId: Types.ObjectId | undefined

    @Field(() => String, { nullable: false })
    address: string;

    @Field(() => String, { nullable: false })
    phone: string;

    @Field(() => PaymentMethodsTypes, { nullable: false })
    paymentMethod: PaymentMethodsTypes;


    @Field(() => OrderStatusTypes, { nullable: false })
    status: OrderStatusTypes;


    @Field(() => Number, { nullable: false })
    totalPrice: number;

    @Field(() => String, { nullable: true })
    paymentIntent: string;
}



@InputType()
export class ListOrderFiltersDTO {

    @Field(() => OrderStatusTypes, { nullable: true })
    @IsString()
    @IsOptional()
    @IsEnum(OrderStatusTypes)
    status: OrderStatusTypes

}


