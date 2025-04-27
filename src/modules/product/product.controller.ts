import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, QueryDTO, UpdateProductDto } from './dto/product.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleTypes } from 'src/common/types/types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models/user.model';
import { multerCloudinaryConfig } from 'src/common/upload files/multer.colud.config';
import { imageTypes } from 'src/common/constants/constants';
import { Types } from 'mongoose';



@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }



    @Post('createProduct')
    @Auth(RoleTypes.admin)
    @UseInterceptors((FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ], multerCloudinaryConfig({ allowedExt: imageTypes }))))
    async createProduct(
        @Body() body: CreateProductDto,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }) {
        return await this.productService.createProduct(body, user, files)
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


    @Patch('updateProduct/:productId')
    @Auth(RoleTypes.admin)
    @UseInterceptors((FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ], multerCloudinaryConfig({ allowedExt: imageTypes }))))
    async updateProduct(
        @Body() body: UpdateProductDto,
        @Param('productId') productId: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }) {
        return await this.productService.updateProduct(body, user, productId, files)
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Get()
    @Auth(RoleTypes.admin)

    async getAllProducts(
        @Query() query: QueryDTO
    ) {
        return await this.productService.getAllProducts(query)
    }
    //////////////////////////////////////////////////////////////////////

    @Delete('deleteProduct/:productId')
    @Auth(RoleTypes.admin)
    async deleteProduct(
        @Param('productId') param: Types.ObjectId,
        @UserDecorator() user: UserDocument
    ) {
        return await this.productService.deleteProduct(param, user)
    }

}
