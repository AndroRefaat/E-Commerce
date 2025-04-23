import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { subCategory, SubCategoryDocument } from "../models/subCategory.model";
@Injectable()
export class SubCategoryRepositoryService extends DatabaseRepository<SubCategoryDocument> {
    constructor(@InjectModel(subCategory.name) readonly SubCategoryModel: Model<SubCategoryDocument>) {
        super(SubCategoryModel)
    }


}