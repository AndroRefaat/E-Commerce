/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: resolve('./config/.env.dev'), isGlobal: true }),
    AuthenticationModule,
    MongooseModule.forRoot(process.env.MONGO_URI!),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
