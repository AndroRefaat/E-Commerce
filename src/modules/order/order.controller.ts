import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleTypes } from 'src/common/types/types';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models/user.model';
import { CreateOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }




    @Post('createOrder')
    @Auth(RoleTypes.admin, RoleTypes.user)
    createOrder(
        @Body() body: CreateOrderDTO,
        @UserDecorator() user: UserDocument
    ) {
        return this.orderService.createOrder(body, user)
    }
    //////////////////////////////////////////////////////////////////////////////////

    @Post('createPayment')
    @Auth(RoleTypes.admin, RoleTypes.user)
    createPayment(
        @Body("orderId") body: string,
        @UserDecorator() user: UserDocument
    ) {
        return this.orderService.createPayment(body, user)
    }

    //////////////////////////////////////////////////////////////////////////////////

    @Get('success')
    success() {
        return this.orderService.success()
    }
    //////////////////////////////////////////////////////////////////////////////////
    @Get('cancel')
    cancel() {
        return this.orderService.cancel()
    }
    //////////////////////////////////////////////////////////////////////////////////

    @Post('webhook')
    webhook(@Body() data: any) {
        return this.orderService.webhook(data)
    }
    //////////////////////////////////////////////////////////////////////////////////
    @Put('cancelOrder')
    @Auth(RoleTypes.admin, RoleTypes.user)
    cancelOrder(
        @Body("orderId") orderId: string,
        @UserDecorator() user: UserDocument
    ) {
        return this.orderService.cancelOrder(orderId, user)
    }


}
