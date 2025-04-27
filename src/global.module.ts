import { Global, Module } from "@nestjs/common";
import { UserModel } from "./DB/models/user.model";
import { UserRepositoryService } from "./DB/Repository/user.repository";
import { TokenService } from "./common/service/token";
import { JwtService } from "@nestjs/jwt";



@Global()
@Module({
    imports: [UserModel],
    controllers: [],
    providers: [UserRepositoryService, TokenService, JwtService],
    exports: [UserModel, UserRepositoryService, TokenService, JwtService],
})
export class GlobalModule { }