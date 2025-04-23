import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { Category, CategoryDocument } from "../models/category.model";
@Injectable()
export class CategoryRepositoryService extends DatabaseRepository<CategoryDocument> {
    constructor(@InjectModel(Category.name) readonly CategoryModel: Model<CategoryDocument>) {
        super(CategoryModel)
    }


}