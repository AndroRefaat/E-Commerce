import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Hash } from "src/common/security/Hash";

export enum RoleTypes {
    user = 'user',
    admin = 'admin',
}
export enum GenderTypes {
    male = 'male',
    female = 'female',
}

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
export class User {

    @Virtual({
        get(this: User) {
            return this.firstName + ' ' + this.lastName
        },
        set(value: string) {
            const [firstName, lastName] = value.split(' ')
            this.firstName = firstName
            this.lastName = lastName
        }
    })
    userName: string

    @Prop({ required: true, minlength: 3, maxlength: 20, trim: true })
    firstName: string;

    @Prop({ required: true, minlength: 3, maxlength: 20, trim: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({})
    phone: string

    @Prop({})
    address: string

    @Prop({ type: Date })
    DOB: Date

    @Prop({ type: Date })
    confirmEmail: Date

    @Prop({})
    confirmOTP: string

    @Prop({ type: String, enum: Object.values(RoleTypes), default: RoleTypes.user })
    role: RoleTypes

    @Prop({ type: String, enum: Object.values(GenderTypes), default: GenderTypes.male })
    gender: GenderTypes

}


export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = Hash(this.password)
    }
    next()
})
export const UserModel = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
])