import { BadRequestException, Inject, Injectable, UploadedFiles } from '@nestjs/common';
import { CreateProductDto, QueryDTO, UpdateProductDto } from './dto/product.dto';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { ProductRepositoryService } from 'src/DB/Repository/product.repository';
import { UserDocument } from 'src/DB/models/user.model';
import { CategoryRepositoryService } from 'src/DB/Repository/category.repository';
import { Types } from 'mongoose';
import { ProductDocument } from 'src/DB/models/product.model';
import { FilterQuery } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class ProductService {
    constructor(
        private readonly productRepositoryService: ProductRepositoryService,
        private readonly fileUploadService: FileUploadService,
        private readonly categoryRepositoryService: CategoryRepositoryService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }





    async createProduct(body: CreateProductDto, user: UserDocument, @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }) {
        const { name, price, description, brand, category, quantity, subCategory, discount, stock } = body


        const categoryExist = await this.categoryRepositoryService.findOne({ _id: category })
        if (!categoryExist) throw new BadRequestException('Category not found')

        if (!files.mainImage) throw new BadRequestException('Main image is required')
        const { secure_url, public_id } = await this.fileUploadService.uploadFile(files.mainImage[0], { folder: `${process.env.FOLDER_NAME}/category/${user._id}/products/mainImage` })

        let subImages: { secure_url: string, public_id: string }[] = []

        if (files.subImages) {
            const results = await this.fileUploadService.uploadFiles(files.subImages, { folder: `${process.env.FOLDER_NAME}/category/${user._id}/products/subImages` })
            subImages.push(...results)
        }

        const subPrice = price - (price * (discount || 0)) / 100


        const product = await this.productRepositoryService.create({
            name,
            price,
            subPrice,
            description,
            brand,
            category: new Types.ObjectId(category),
            quantity,
            subCategory,
            mainImage: { secure_url, public_id },
            subImages,
            discount,
            stock,
            addedBy: user._id
        })
        return { message: 'Product created successfully', product }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async updateProduct(body: UpdateProductDto, user: UserDocument, productId: Types.ObjectId, @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }) {
        const { name, price, description, brand, category, quantity, subCategory, discount, stock } = body

        const product = await this.productRepositoryService.findOne({ _id: productId, addedBy: user._id })
        if (!product) throw new BadRequestException('Product not found')



        const categoryExist = await this.categoryRepositoryService.findOne({ _id: category })
        if (!categoryExist) throw new BadRequestException('Category not found')


        if (name) {
            if (product.name === name) throw new BadRequestException('Product name already exists')
            product.name = name
        }


        if (files.mainImage) {
            await this.fileUploadService.deleteFile(product.mainImage['public_id'])
            const { secure_url, public_id } = await this.fileUploadService.uploadFile(files.mainImage[0], { folder: `${process.env.FOLDER_NAME}/category/${user._id}/products/mainImage` })
            product.mainImage = { secure_url, public_id }
        }

        let subImages: { secure_url: string, public_id: string }[] = []
        if (files.subImages) {
            await this.fileUploadService.deleteFolder(`${process.env.FOLDER_NAME}/category/${user._id}/products/subImages`)
            const results = await this.fileUploadService.uploadFiles(files.subImages, { folder: `${process.env.FOLDER_NAME}/category/${user._id}/products/subImages` })
            subImages.push(...results)
            product.subImages = subImages
        }

        const subPrice = price - (price * (discount || 0)) / 100

        if (price && discount) {
            product.subPrice = price - (price * (discount || 0)) / 100
            product.price = price
            product.discount = discount
        }
        else if (price) {
            product.subPrice = price - (price * (product.discount || 0)) / 100
            product.price = price
        }
        else if (discount) {
            product.subPrice = product.price - (product.price * (discount || 0)) / 100
            product.discount = discount
        }

        if (quantity) product.quantity = quantity

        if (stock) {
            if (stock > quantity) throw new BadRequestException('Stock cannot be greater than quantity')
            product.stock = stock
        }

        await product.save()
        return { message: 'Product updated successfully', product }

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getAllProducts(query: QueryDTO) {
        // const { name, select, sort, page } = query

        // let filterObj: FilterQuery<ProductDocument> = {}
        // if (name) {
        //     filterObj = {
        //         $or: [
        //             { name: { $regex: name, $options: 'i' } },
        //             { slug: { $regex: name, $options: 'i' } }
        //         ]
        //     }
        // }

        // const products = await this.productRepositoryService.find({
        //     filter: filterObj,
        //     // populate: [{ path: 'category', select: 'name' }],
        //     sort,
        //     select,
        //     page
        // })

        // return { message: 'Products fetched successfully', products }
        ////////////////with caching //////////////////////

        const products = await this.cacheManager.get('list')
        if (!products) {
            const products = await this.productRepositoryService.find({})
            await this.cacheManager.set('list', products, 2000)
        }
        return { message: 'Products fetched successfully', products }

    }

    /////////////////////////////////////////////////////////////////////////////

    async deleteProduct(productId: Types.ObjectId, user: UserDocument) {
        const product = await this.productRepositoryService.findOne({ _id: productId })
        if (!product) throw new BadRequestException('Product not found')
        await this.fileUploadService.deleteFile(product.mainImage['public_id'])
        await this.fileUploadService.deleteFolder(`${process.env.FOLDER_NAME}/category/${user._id}/products/subImages`)
        await this.productRepositoryService.findOneAndDelete({ _id: productId })
        return { message: 'Product deleted successfully' }
    }

}
