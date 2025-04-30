import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentMethodsTypes } from "./../../common/types/types";
import { OrderRepositoryService } from 'src/DB/Repository/order.repository';
import { CreateOrderDTO } from './dto/order.dto';
import { UserDocument } from 'src/DB/models/user.model';
import { CartRepositoryService } from 'src/DB/Repository/cart.repository';
import { OrderStatusTypes } from 'src/common/types/types';
import { PaymentService } from 'src/common/payment/service/payment';
import { CouponRepositoryService } from 'src/DB/Repository/coupon.repository';
import { ref } from 'process';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepositoryService: OrderRepositoryService,
        private readonly cartRepositoryService: CartRepositoryService,
        private readonly paymentService: PaymentService,
        private readonly couponRepositoryService: CouponRepositoryService
    ) { }


    async createOrder(body: CreateOrderDTO, user: UserDocument) {
        const { phone, address, paymentMethod } = body
        const cart = await this.cartRepositoryService.findOne({ addedBy: user._id })
        if (!cart || cart.products.length === 0) throw new BadRequestException('Cart is empty')

        const order = await this.orderRepositoryService.create({
            addedBy: user._id,
            cartId: cart._id,
            phone,
            address,
            paymentMethod,
            totalPrice: cart.subTotal,
            status: paymentMethod === OrderStatusTypes.cash ? OrderStatusTypes.placed : OrderStatusTypes.pending
        })
        return { message: 'Order created successfully', order }
    }

    //////////////////////////////////////////////////////////////////////////////////

    async createPayment(orderId: string, user: UserDocument) {
        const order = await this.orderRepositoryService.findOne(
            { _id: orderId, addedBy: user._id, status: OrderStatusTypes.pending },
            [{
                path: 'cartId',
                select: 'products',
                populate: { path: 'products.productId' }
            }]
        )
        if (!order) throw new BadRequestException('Order not found')

        let discounts: { coupon: string }[] = [];
        if (order.couponId) {
            const coupon = await this.couponRepositoryService.findById(order.couponId);
            if (coupon) {
                discounts.push({ coupon: coupon.code });
            } else {
                console.log(`Coupon with ID ${order.couponId} not found for order ${order._id}`);
            }
        }

        // const coupon = await this.paymentService.createCoupon({ percent_off: 10 })


        const session = await this.paymentService.createCheckoutSession({
            customer_email: user.email,
            metadata: { orderId: order._id.toString() },
            line_items: order.cartId["products"].map(product => ({
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.mainImage.secure_url]
                    },
                    unit_amount: product.productId.subPrice * 100
                },
                quantity: product.quantity
            })),
            discounts: discounts,
            // discounts:[{coupon: coupon.id}]
        })

        return { url: session.url }
    }
    //////////////////////////////////////////////////////////////////////////////////

    async success() {
        return { message: "payment successfully" }
    }
    //////////////////////////////////////////////////////////////////////////////////
    async cancel() {
        return { message: "payment is failure!!!" }
    }
    //////////////////////////////////////////////////////////////////////////////////

    async webhook(data: any) {
        console.log(data);
        const orderId = data.data.object.metadata.orderId;
        const order = await this.orderRepositoryService.findOneAndUpdate({ _id: orderId },
            {
                status: OrderStatusTypes.paid,
                orderChanges: {
                    paidAt: Date.now()
                },
                paymentIntent: data.data.object.payment_intent
            },

        );
        return { message: "webhook successfully", order }
    }
    //////////////////////////////////////////////////////////////////////////////////

    async cancelOrder(orderId: string, user: UserDocument) {

        const order = await this.orderRepositoryService.findOneAndUpdate({
            _id: orderId,
            addedBy: user._id,
            status: { $in: [OrderStatusTypes.pending, OrderStatusTypes.placed, OrderStatusTypes.paid] }
        }, {
            status: OrderStatusTypes.cancelled,
            orderChanges: {
                cancelledAt: new Date(),
                cancelledBy: user._id
            }
        })
        if (!order) throw new BadRequestException('Order not found')
        if (order.paymentMethod == PaymentMethodsTypes.card) {
            await this.paymentService.refund({ payment_intent: order.paymentIntent, reason: 'requested_by_customer' })
            await this.orderRepositoryService.findOneAndUpdate({ _id: orderId, addedBy: user._id },
                {
                    status: OrderStatusTypes.refunded,
                    orderChanges: { refundedAt: Date.now(), refundedBy: user._id }
                })
        }
        return { message: 'Order cancelled successfully', order }

    }


}




