import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { Product } from "./product.model";
import { Cart } from "./cart.model";
import { OrderStatusTypes, PaymentMethodsTypes } from "src/common/types/types";
import { Coupon } from "./coupon.model";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
export class Order {


    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: Cart.name, required: true })
    cartId: Types.ObjectId

    @Prop({ type: Number })
    totalPrice: number

    @Prop({ type: String, required: true })
    phone: string

    @Prop({ type: String, required: true })
    address: string

    @Prop({ type: String, enum: PaymentMethodsTypes, required: true })
    paymentMethod: string

    @Prop({ type: String, enum: OrderStatusTypes, required: true })
    status: string

    @Prop({ type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
    arrivesAt: Date

    @Prop({ type: Types.ObjectId, ref: Coupon.name })
    couponId: Types.ObjectId

    @Prop({
        type: Object,
        paidAt: Date,
        deliveredAt: Date,
        deliverBy: { type: Types.ObjectId, ref: User.name },
        cancelledAt: Date,
        cancelledBy: { type: Types.ObjectId, ref: User.name },
        refundedAt: Date,
        refundedBy: { type: Types.ObjectId, ref: User.name },
    })
    orderChanges: object

    @Prop({ type: String })
    paymentIntent: string
}


export type OrderDocument = HydratedDocument<Order>
export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderModel = MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema }
]) 