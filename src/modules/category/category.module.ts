import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepositoryService } from "src/DB/Repository/category.repository";
import { CategoryModel } from "src/DB/models/category.model";
import { UserRepositoryService } from "src/DB/Repository/user.repository";
import { TokenService } from "src/common/service/token";
import { JwtService } from "@nestjs/jwt";
import { UserModel } from "src/DB/models/user.model";
import { FileUploadService } from "src/common/service/fileUpload.service";




@Module({
    imports: [UserModel, CategoryModel],
    controllers: [CategoryController],
    providers: [CategoryService, UserRepositoryService, TokenService, JwtService, CategoryRepositoryService, FileUploadService]
})
export class CategoryModule { }