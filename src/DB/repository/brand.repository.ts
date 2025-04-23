import { InjectModel } from "@nestjs/mongoose";
import { BrandDocument } from "./../models/brand.model";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { Brand } from "../models/brand.model";
@Injectable()
export class BrandRepositoryService extends DatabaseRepository<BrandDocument> {
    constructor(@InjectModel(Brand.name) readonly BrandModel: Model<BrandDocument>) {
        super(BrandModel)
    }


}