
import { FilterQuery, Model, PopulateOptions } from "mongoose";
import { Types } from "mongoose";



export abstract class DatabaseRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) { }

    async findOne({ filter, populate }: { filter?: FilterQuery<TDocument>, populate?: PopulateOptions[] }): Promise<TDocument | null> {
        return this.model.findOne(filter || {}).populate(populate || [])
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




}