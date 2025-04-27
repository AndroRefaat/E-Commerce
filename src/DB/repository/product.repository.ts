import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "../models/product.model";
import { DatabaseRepository } from "./Database.repository";
import { Model } from "mongoose";

@Injectable()
export class ProductRepositoryService extends DatabaseRepository<ProductDocument> {
    constructor(@InjectModel(Product.name) readonly ProductModel: Model<ProductDocument>) {
        super(ProductModel)
    }


}