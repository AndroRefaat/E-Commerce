/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { GlobalModule } from './global.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GQLModule } from './graphql/graphql.module';




@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: resolve('./config/.env.dev'), isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    CoreModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/schema.gql',
    }),
    GQLModule,
    GlobalModule,
    AuthenticationModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
