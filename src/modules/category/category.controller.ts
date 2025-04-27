import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleTypes } from "src/common/types/types";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./dto/category.dto";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { UserDocument } from "src/DB/models/user.model";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { multerConfig } from "src/common/upload files/multer.config";
import { imageTypes } from "src/common/constants/constants";
import { multerCloudinaryConfig } from "src/common/upload files/multer.colud.config";
import { Types } from "mongoose";

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }


    @Post('createCategory')
    @Auth(RoleTypes.admin)
    @UseInterceptors(FileInterceptor('image', multerCloudinaryConfig({ allowedExt: imageTypes })))
    createCategory(
        @Body() body: CreateCategoryDTO,
        @UserDecorator() user: UserDocument,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.categoryService.createCategory(body, user, image)
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    @Patch('updateCategory/:id')
    @Auth(RoleTypes.admin)
    @UseInterceptors(FileInterceptor('image', multerCloudinaryConfig({ allowedExt: imageTypes })))
    updateCategory(
        @Body() body: UpdateCategoryDTO,
        @Param('id') id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.categoryService.updateCategory(body, id, user, image)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteCategory/:id')
    @Auth(RoleTypes.admin)
    @UseInterceptors(FileInterceptor('image', multerCloudinaryConfig({ allowedExt: imageTypes })))
    deleteCategory(
        @Param('id') id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.categoryService.deleteCategory(id, user, image)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////


    @Get('getCategory/:id')
    @Auth(RoleTypes.admin)
    getCategory(
        @Param('id') id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
    ) {
        return this.categoryService.getCategory(id, user)
    }


    /////////////////////////////////////////////////////////////////////////////////////////////

    @Get('getAllCategories')
    @Auth(RoleTypes.admin)
    getAllCategories(
        @UserDecorator() user: UserDocument,
    ) {
        return this.categoryService.getAllCategories(user)
    }


}