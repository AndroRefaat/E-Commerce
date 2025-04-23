import { InjectModel } from "@nestjs/mongoose";
import { OTPDocument } from "./../models/otp.model";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { OTP } from "../models/otp.model";
import { Types } from "mongoose";
import { OTPTypes } from 'src/common/types/types';

interface OTPOptions {
    otp: string,
    expiredAt: Date,
    userId: Types.ObjectId,
    otpTypes: OTPTypes,
}

@Injectable()
export class OTPRepositoryService extends DatabaseRepository<OTPDocument> {
    constructor(@InjectModel(OTP.name) readonly OTPModel: Model<OTPDocument>) {
        super(OTPModel)
    }

    createOTP({ otp, expiredAt, userId, otpTypes }: OTPOptions) {
        return this.create({
            otp,
            expiredAt: expiredAt || new Date(Date.now() + 1000 * 60 * 1000), // 10 min 
            userId,
            otpTypes
        })
    }

}