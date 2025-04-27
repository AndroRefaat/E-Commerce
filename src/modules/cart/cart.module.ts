import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from 'src/DB/models/cart.model';
import { CartRepositoryService } from 'src/DB/Repository/cart.repository';
import { ProductRepositoryService } from 'src/DB/Repository/product.repository';
import { ProductModel } from 'src/DB/models/product.model';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, CartRepositoryService, ProductRepositoryService]
})
export class CartModule { }
