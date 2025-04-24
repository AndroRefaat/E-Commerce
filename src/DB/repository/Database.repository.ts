
import { FilterQuery, Model, PopulateOptions } from "mongoose";
import { Types } from "mongoose";



export abstract class DatabaseRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) { }

    async findOne(query: FilterQuery<TDocument>) {
        return this.model.findOne(query)
    }


    async create(data: Partial<TDocument>): Promise<TDocument> {
        return this.model.create(data)
    }

    async findById(id: Types.ObjectId): Promise<TDocument | null> {
        return this.model.findById(id)
    }

    async findOneAndUpdate(query: FilterQuery<TDocument>, date: Partial<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndUpdate(query, date, { new: true, runValidators: true })
    }

    async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndDelete(query)
    }



}