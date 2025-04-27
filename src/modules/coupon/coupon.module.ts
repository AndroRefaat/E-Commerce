import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponRepositoryService } from 'src/DB/Repository/coupon.repository';
import { CouponModel } from 'src/DB/models/coupon.model';

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepositoryService]
})
export class CouponModule { }
