import { Module } from "@nestjs/common";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";
import { UserModel } from "src/DB/models/user.model";
import { UserRepositoryService } from "src/DB/Repository/user.repository";
import { TokenService } from "src/common/service/token";
import { JwtService } from "@nestjs/jwt";
import { OTPRepositoryService } from "src/DB/Repository/otp.repository";
import { OTPModel } from "src/DB/models/otp.model";


@Module({
    imports: [UserModel, OTPModel],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, UserRepositoryService, TokenService, JwtService, OTPRepositoryService]
})
export class AuthenticationModule { }