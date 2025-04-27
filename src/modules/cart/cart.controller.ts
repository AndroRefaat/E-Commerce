import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { createCartDTO, DeleteCartDTO, RemoveCartDTO, UpdateCartDTO } from './dto/cart.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models/user.model';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleTypes } from 'src/common/types/types';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }


    @Post('createCart')
    @Auth(RoleTypes.admin, RoleTypes.user)
    async createCart(
        @Body() body: createCartDTO,
        @UserDecorator() user: UserDocument
    ) {
        return this.cartService.createCart(body, user)
    }

    ////////////////////////////////////////////////////////////////////

    @Patch('removeCart')
    @Auth(RoleTypes.admin, RoleTypes.user)
    async removeCart(
        @Body() body: RemoveCartDTO,
        @UserDecorator() user: UserDocument
    ) {
        return this.cartService.removeFromCart(body, user)
    }
    ////////////////////////////////////////////////////////////////////

    @Delete('deleteCart')
    @Auth(RoleTypes.admin, RoleTypes.user)
    async deleteCart(
        @Body() body: DeleteCartDTO,
        @UserDecorator() user: UserDocument
    ) {
        return this.cartService.deleteCart(body, user)
    }

    ////////////////////////////////////////////////////////////////////
    @Patch('updateCart')
    @Auth(RoleTypes.admin, RoleTypes.user)
    async updateCart(
        @Body() body: UpdateCartDTO,
        @UserDecorator() user: UserDocument
    ) {
        return this.cartService.updateCart(body, user)
    }

    ////////////////////////////////////////////////////////////////////
    @Get('getCart/:cartId')
    @Auth(RoleTypes.admin, RoleTypes.user)
    async getCart(
        @Param('cartId') param: Types.ObjectId,
        @UserDecorator() user: UserDocument
    ) {
        return this.cartService.getCart(param, user)
    }



}
