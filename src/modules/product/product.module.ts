import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductModel } from 'src/DB/models/product.model';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { ProductRepositoryService } from 'src/DB/Repository/product.repository';
import { CategoryRepositoryService } from 'src/DB/Repository/category.repository';
import { CategoryModel } from 'src/DB/models/category.model';

@Module({
  imports: [ProductModel, CategoryModel],
  controllers: [ProductController],
  providers: [ProductService, ProductRepositoryService, FileUploadService, CategoryRepositoryService]
})
export class ProductModule { }
