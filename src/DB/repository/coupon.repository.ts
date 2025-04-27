import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { Coupon, CouponDocument } from "../models/coupon.model";

@Injectable()
export class CouponRepositoryService extends DatabaseRepository<CouponDocument> {
    constructor(@InjectModel(Coupon.name) readonly CouponModel: Model<CouponDocument>) {
        super(CouponModel)
    }


}