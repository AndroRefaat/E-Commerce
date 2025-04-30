import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
import { Order, OrderDocument } from "../models/order.model";

@Injectable()
export class OrderRepositoryService extends DatabaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) readonly OrderModel: Model<OrderDocument>) {
        super(OrderModel)
    }


}