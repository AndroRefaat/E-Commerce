import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./dto/category.dto";
import { UserDocument } from "src/DB/models/user.model";
import { CategoryRepositoryService } from "src/DB/Repository/category.repository";
import { FileUploadService } from "src/common/service/fileUpload.service";
import { Types } from "mongoose";
import slugify from "slugify";
import { repl } from "@nestjs/core";


@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepositoryService: CategoryRepositoryService,
        private readonly fileUploadService: FileUploadService
    ) { }

    async createCategory(body: CreateCategoryDTO, user: UserDocument, image: Express.Multer.File) {
        const { name } = body
        const categoryExist = await this.categoryRepositoryService.findOne({ name })
        if (categoryExist) throw new BadRequestException('Category already exists')

        let data = { name, addedBy: user._id }
        if (image) {
            const { secure_url, public_id } = await this.fileUploadService.uploadFile(image, { folder: `${process.env.FOLDER_NAME}/category/${user._id}` })
            data['image'] = { secure_url, public_id }
        }
        const category = await this.categoryRepositoryService.create(data)
        return { message: 'Category created successfully', category }
    }

    //////////////////////////////////////////////////////////////////////

    async updateCategory(body: UpdateCategoryDTO, id: Types.ObjectId, user: UserDocument, image: Express.Multer.File) {
        const { name } = body

        const category = await this.categoryRepositoryService.findById(id)
        if (!category) throw new BadRequestException('Category not found')

        if (name) {
            const categoryExist = await this.categoryRepositoryService.findOne({ name })
            if (categoryExist) throw new BadRequestException('Category already exists')
            category.name = name;
            category.slug = slugify(name, { replacement: '-', lower: true, trim: true });
        }


        if (image) {
            await this.fileUploadService.deleteFile(category.image['public_id'])
            const { secure_url, public_id } = await this.fileUploadService.uploadFile(image, { folder: `${process.env.FOLDER_NAME}/category/${user._id}` })
            category.image = { secure_url, public_id }
        }
        await category.save()
        return { message: 'Category updated successfully', category }
    }


    //////////////////////////////////////////////////////////////////////////////////////

    async deleteCategory(id: Types.ObjectId, user: UserDocument, image: Express.Multer.File) {

        const category = await this.categoryRepositoryService.findOneAndDelete({ _id: id })
        if (!category) throw new BadRequestException('Category not found')


        if (category.image) {
            await this.fileUploadService.deleteFolder(`${process.env.FOLDER_NAME}/category/${user._id}`)
        }
        return { message: 'Category deleted successfully' }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    async getCategory(id: Types.ObjectId, user: UserDocument) {

        const category = await this.categoryRepositoryService.findOne({ _id: id, addedBy: user._id })
        if (!category) throw new BadRequestException('Category not found')


        return { message: 'category found successfully', category }
    }




}