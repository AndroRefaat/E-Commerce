import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CartRepositoryService } from 'src/DB/Repository/cart.repository';
import { createCartDTO, DeleteCartDTO, RemoveCartDTO, UpdateCartDTO } from './dto/cart.dto';
import { UserDocument } from 'src/DB/models/user.model';
import { ProductRepositoryService } from 'src/DB/Repository/product.repository';
import { Types } from 'mongoose';


@Injectable()
export class CartService {
    constructor(
        private readonly cartRepositoryService: CartRepositoryService,
        private readonly productRepositoryService: ProductRepositoryService
    ) { }


    async createCart(body: createCartDTO, user: UserDocument) {
        const { productId, quantity } = body
        const product = await this.productRepositoryService.findOne({ _id: productId, addedBy: user._id, stock: { $gt: quantity } })
        if (!product) throw new BadRequestException('Product not found')

        const cart = await this.cartRepositoryService.findOne({ addedBy: user._id })
        if (!cart) {
            return await this.cartRepositoryService.create({
                addedBy: user._id,
                products: [{
                    productId: new Types.ObjectId(productId),
                    quantity,
                    finalPrice: product.subPrice
                }]
            })
        }

        let productExist = cart.products.find(prod => prod.productId.toString() === productId.toString())
        if (productExist) throw new BadRequestException('Product already exists in cart')

        cart.products.push({
            productId: new Types.ObjectId(productId),
            quantity,
            finalPrice: product.subPrice
        })
        await cart.save()
        return { message: 'Product added to cart successfully', cart }
    }

    //////////////////////////////////////////////////////////////////////////
    async removeFromCart(body: RemoveCartDTO, user: UserDocument) {
        const { productId } = body
        const product = await this.productRepositoryService.findOne({ _id: productId, addedBy: user._id })
        if (!product) throw new BadRequestException('Product not found')

        const cart = await this.cartRepositoryService.findOne({ addedBy: user._id, "products.productId": productId })
        if (!cart) throw new BadRequestException('Product not found in cart')

        cart.products = cart.products.filter(prod => prod.productId.toString() !== productId.toString())
        await cart.save()
        return { message: 'Product removed from cart successfully' }

    }

    ////////////////////////////////////////////////////////////////////

    async deleteCart(body: DeleteCartDTO, user: UserDocument) {
        const { cartId } = body
        const cart = await this.cartRepositoryService.findOne({ _id: cartId, addedBy: user._id })
        if (!cart) throw new BadRequestException('Cart not found')
        await this.cartRepositoryService.findOneAndDelete({ _id: cartId })
        return { message: 'Cart deleted successfully' }
    }

    ////////////////////////////////////////////////////////////////////

    async updateCart(body: UpdateCartDTO, user: UserDocument) {
        const { productId, quantity } = body;

        const cart = await this.cartRepositoryService.findOne({
            addedBy: user._id,
            "products.productId": productId
        });
        if (!cart) {
            throw new BadRequestException('Product not found in your cart');
        }

        const productInCart = cart.products.find(prod => prod.productId.toString() === productId.toString());
        if (!productInCart) {
            throw new BadRequestException('Product not found in your cart');
        }

        const product = await this.productRepositoryService.findOne({ _id: productId });
        if (!product) {
            throw new BadRequestException('Product not found in products list');
        }

        if (product.stock < quantity) {
            throw new BadRequestException(`Only ${product.stock} items left in stock`);
        }

        productInCart.quantity = quantity;
        productInCart.finalPrice = product.subPrice;

        await cart.save();

        return { message: 'Product quantity updated successfully', cart };
    }
    ////////////////////////////////////////////////////////////////////

    async getCart(cartId: Types.ObjectId, user: UserDocument) {
        const cart = await this.cartRepositoryService.findOne({ _id: cartId, addedBy: user._id })
        if (!cart) throw new BadRequestException('Cart not found')
        return { message: 'Cart found successfully', cart }
    }



}
