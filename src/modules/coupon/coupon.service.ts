import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { CouponRepositoryService } from 'src/DB/Repository/coupon.repository';
import { UserDocument } from 'src/DB/models/user.model';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {
    constructor(
        private readonly couponRepositoryService: CouponRepositoryService
    ) { }

    async createCoupon(body: CreateCouponDto, user: UserDocument) {
        const { code, amount, fromDate, toDate } = body

        const couponExist = await this.couponRepositoryService.findOne({ code })
        if (couponExist) throw new BadRequestException('Coupon already exist')

        const coupon = await this.couponRepositoryService.create({ code, amount, fromDate, toDate, addedBy: user._id })
        return { message: 'Coupon created successfully', coupon }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async updateCoupon(body: UpdateCouponDto, user: UserDocument, couponId: Types.ObjectId) {
        const { code, amount, fromDate, toDate } = body

        const coupon = await this.couponRepositoryService.findById(couponId)
        if (!coupon) throw new BadRequestException('Coupon not found')

        if (code) coupon.code = code
        if (amount) coupon.amount = amount
        if (fromDate) coupon.fromDate = fromDate
        if (toDate) coupon.toDate = toDate
        await coupon.save()
        return { message: 'Coupon updated successfully', coupon }
    }
    //////////////////////////////////////////////////////////////////////////

    async deleteCoupon(user: UserDocument, couponId: Types.ObjectId) {
        const coupon = await this.couponRepositoryService.findById(couponId)
        if (!coupon) throw new BadRequestException('Coupon not found')

        await this.couponRepositoryService.findOneAndDelete({ _id: couponId, addedBy: user._id })
        return { message: 'Coupon deleted successfully' }
    }


}
