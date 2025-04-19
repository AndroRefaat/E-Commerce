import { FilterQuery, Model, PopulateOptions } from "mongoose";


export abstract class DatabaseRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) { }

    async findOne({ filter, populate }: { filter?: FilterQuery<TDocument>, populate?: PopulateOptions[] }): Promise<TDocument | null> {
        return this.model.findOne(filter || {}).populate(populate || [])
    }


    async create(data: Partial<TDocument>): Promise<TDocument> {
        return this.model.create(data)
    }
}