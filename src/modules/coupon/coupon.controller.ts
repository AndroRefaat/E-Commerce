import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models/user.model';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleTypes } from 'src/common/types/types';
import { Types } from 'mongoose';

@Controller('coupon')
export class CouponController {
    constructor(
        private readonly couponService: CouponService
    ) { }

    @Post('createCoupon')
    @Auth(RoleTypes.admin)
    async createCoupon(
        @Body() body: CreateCouponDto,
        @UserDecorator() user: UserDocument
    ) {
        return this.couponService.createCoupon(body, user)
    }

    //////////////////////////////////////////////////////////////////////////

    @Patch('updateCoupon/:couponId')
    @Auth(RoleTypes.admin)
    async updateCoupon(
        @Body() body: UpdateCouponDto,
        @Param('couponId') couponId: Types.ObjectId,
        @UserDecorator() user: UserDocument
    ) {
        return this.couponService.updateCoupon(body, user, couponId)
    }

    //////////////////////////////////////////////////////////////////////////

    @Delete('deleteCoupon/:couponId')
    @Auth(RoleTypes.admin)
    async deleteCoupon(
        @Param('couponId') couponId: Types.ObjectId,
        @UserDecorator() user: UserDocument
    ) {
        return this.couponService.deleteCoupon(user, couponId)
    }
}
