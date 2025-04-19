import { Module } from "@nestjs/common";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";
import { UserModel } from "src/DB/models/user.model";
import { UserRepositoryService } from "src/DB/repository/user.repository";
import { TokenService } from "src/common/service/token";
import { JwtService } from "@nestjs/jwt";


@Module({
    imports: [UserModel],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, UserRepositoryService, TokenService, JwtService]
})
export class AuthenticationModule { }