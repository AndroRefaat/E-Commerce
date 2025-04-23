import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { User, UserDocument } from 'src/DB/models/user.model';
import { Model } from "mongoose";
import { DatabaseRepository } from "./Database.repository";
@Injectable()
export class UserRepositoryService extends DatabaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) readonly UserModel: Model<UserDocument>) {
        super(UserModel)
    }


}