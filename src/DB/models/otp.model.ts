import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

import { User } from "./user.model";
import { OTPTypes } from "src/common/types/types";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
export class OTP {
    @Prop({ type: String, required: true })
    otp: string

    @Prop({ type: String, enum: OTPTypes, required: true })
    otpTypes: string

    @Prop({ type: Date, required: true })
    expiredAt: Date

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId

}


export type OTPDocument = HydratedDocument<OTP>
export const OTPSchema = SchemaFactory.createForClass(OTP);
export const OTPModel = MongooseModule.forFeature([
    { name: OTP.name, schema: OTPSchema }
]) 