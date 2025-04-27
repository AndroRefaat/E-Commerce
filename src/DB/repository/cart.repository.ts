import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { Cart, CartDocument } from "../models/cart.model";

@Injectable()
export class CartRepositoryService extends DatabaseRepository<CartDocument> {
    constructor(@InjectModel(Cart.name) readonly CartModel: Model<CartDocument>) {
        super(CartModel)
    }


}