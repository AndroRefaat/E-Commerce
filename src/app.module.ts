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


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: resolve('./config/.env.dev'), isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    GlobalModule,
    AuthenticationModule,
    CategoryModule,
    ProductModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
