
import { FilterQuery, Model, PopulateOptions } from "mongoose";
import { Types } from "mongoose";

interface findOptions<TDocument> {
    filter?: FilterQuery<TDocument>;
    populate?: PopulateOptions[];
    select?: string
    sort?: string
    page?: number
}

export abstract class DatabaseRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) { }

    async findOne(query: FilterQuery<TDocument>, populate?: PopulateOptions[]): Promise<TDocument | null> {
        return this.model.findOne(query).populate(populate || [])
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
        return this.model.findOneAndDelete(query, { new: true, runValidators: true })
    }

    async findAll(query: FilterQuery<TDocument> = {}): Promise<TDocument[]> {
        return this.model.find(query || {});
    }

    async find({ filter = {}, populate = [], page = 1, sort = "", select = "" }: findOptions<TDocument>) {
        const query = this.model.find(filter)
        if (populate) query.populate(populate)
        if (select) query.select(select.replaceAll(",", " "))
        if (sort) query.sort(sort.replaceAll(",", " "))
        if (!page) return query

        const limit = 2
        const skip = (page - 1) * limit
        const results = await query.skip(skip).limit(limit)
        return results
    }

}