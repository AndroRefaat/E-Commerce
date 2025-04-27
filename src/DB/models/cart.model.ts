import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model";
import { Category } from "./category.model";
import { subCategory } from "./subCategory.model";
import { Type } from "@nestjs/common";
import { Product } from "./product.model";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
export class Cart {


    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: Types.ObjectId

    @Prop({
        type: [{
            productId: { type: Types.ObjectId, ref: Product.name, required: true }, quantity: { type: Number, required: true }, finalPrice: { type: Number, required: true }
        }], required: true
    })
    products: { productId: Types.ObjectId, quantity: number, finalPrice: number }[]

    @Prop({ type: Number })
    subTotal: number
}


export type CartDocument = HydratedDocument<Cart>
export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('save', function (next) {
    this.subTotal = this.products.reduce((acc, prod) => acc + (prod.finalPrice * prod.quantity), 0)
    next()
})

export const CartModel = MongooseModule.forFeature([
    { name: Cart.name, schema: CartSchema }
]) 