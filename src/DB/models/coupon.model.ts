import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model";
import { Category } from "./category.model";
import { subCategory } from "./subCategory.model";
import { Type } from "@nestjs/common";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
export class Coupon {
    @Prop({ type: String, required: true, minlength: 1, trim: true, unique: true })
    code: string

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: Types.ObjectId

    @Prop({ type: Number, min: 1, max: 100, required: true })
    amount: number

    @Prop({ type: Date, required: true })
    fromDate: Date

    @Prop({ type: Date, required: true })
    toDate: Date

    @Prop({ type: [Types.ObjectId], ref: User.name })
    usedBy: Types.ObjectId[]
}


export type CouponDocument = HydratedDocument<Coupon>
export const CouponSchema = SchemaFactory.createForClass(Coupon);
export const CouponModel = MongooseModule.forFeature([
    { name: Coupon.name, schema: CouponSchema }
]) 