import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderModel } from 'src/DB/models/order.model';
import { OrderRepositoryService } from 'src/DB/Repository/order.repository';
import { CartModel } from 'src/DB/models/cart.model';
import { CartRepositoryService } from 'src/DB/Repository/cart.repository';
import { PaymentService } from 'src/common/payment/service/payment';
import { CouponRepositoryService } from 'src/DB/Repository/coupon.repository';
import { CouponModel } from 'src/DB/models/coupon.model';

@Module({
  imports: [OrderModel, CartModel, CouponModel],
  controllers: [OrderController],
  providers: [OrderService, OrderRepositoryService, CartRepositoryService, PaymentService, CouponRepositoryService],
  exports: [OrderService, OrderRepositoryService, CartRepositoryService, PaymentService, CouponRepositoryService],
})
export class OrderModule { }
