import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model";
import { Category } from "./category.model";
import { subCategory } from "./subCategory.model";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
export class Brand {
    @Prop({ type: String, required: true, minlength: 3, maxlength: 20, trim: true })
    name: string

    @Prop({
        type: String,
        default: function () {
            return slugify(this.name, { lower: true, trim: true, replacement: '-' })
        }
    })
    slug: string

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    category: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: subCategory.name, required: true })
    subCategory: Types.ObjectId

    @Prop({ type: Object })
    image: Object
}


export type BrandDocument = HydratedDocument<Brand>
export const BrandSchema = SchemaFactory.createForClass(Brand);
export const BrandModel = MongooseModule.forFeature([
    { name: Brand.name, schema: BrandSchema }
]) 