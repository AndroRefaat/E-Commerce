import { Injectable } from "@nestjs/common";
import { Stripe } from "stripe";


@Injectable()
export class PaymentService {
    constructor() { }
    private readonly stripe = new Stripe(process.env.STRIPE_KEY!)

    async createCheckoutSession({
        customer_email,
        metadata,
        line_items,
        discounts
    }) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email,
            metadata,
            success_url: "http://localhost:3000/order/success",
            cancel_url: "http://localhost:3000/order/cancel",
            line_items,
            discounts
        })
    }

    async createCoupon({ percent_off }) {
        return await this.stripe.coupons.create({
            duration: "once",
            percent_off
        })
    }

    async refund({ payment_intent, reason }) {
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        })
    }

}  