import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./Database.repository";
import { ConflictException, Injectable } from "@nestjs/common";
import { User, UserModel } from 'src/DB/models/user.model';
import { FilterQuery, Model } from "mongoose";
@Injectable()
export class UserRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor(@InjectModel(User.name) readonly UserModel: Model<TDocument>) {
        super(UserModel)
    }

    async checkDuplicatedEmail(data: FilterQuery<TDocument>): Promise<null> {
        const checkUser = await this.findOne({ filter: data })
        if (checkUser) {
            throw new ConflictException('User already exists')
        }

        return null
    }

}