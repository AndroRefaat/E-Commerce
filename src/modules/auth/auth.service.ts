import { ConflictException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User, UserDocument } from 'src/DB/models/user.model';
import { InjectModel } from "@nestjs/mongoose";
import { CreateAccountDTO, LoginDTO } from "./dto/auth.dto";
import { UserRepositoryService } from '../../DB/Repository/user.repository';
import { sendEmail } from "src/common/email/sendEmail";
import randomstring from "randomstring";
import { TokenService } from "src/common/service/token";
import { CompareHash } from "src/common/security/Hash";



@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userRepositoryService: UserRepositoryService<UserDocument>,
        private readonly tokenService: TokenService
    ) { }

    async signup(body: CreateAccountDTO) {
        try {
            const { email, password, firstName, lastName } = body;
            const checkUser = await this.userRepositoryService.findOne({ filter: { email } })
            if (checkUser) {
                throw new ConflictException('User already exists')
            }
            const OTPCode = Math.floor(100000 + Math.random() * 900000).toString()
            await sendEmail({ to: email, subject: 'Welcome to our service', html: `<h1>${OTPCode}</h1>` })
            const user = await this.userRepositoryService.create({ email, password, firstName, lastName })
            return { message: "User created successfully", user }
        } catch (error) {
            throw new ConflictException('Erorr', error.message)
        }
    }

    async login(body: LoginDTO) {
        try {
            const { email, password } = body;
            const checkUser = await this.userRepositoryService.findOne({ filter: { email } })
            if (!checkUser) {
                throw new ConflictException('User does not exist')
            }
            if (!CompareHash(password, checkUser.password)) {
                throw new ConflictException('Invalid password')
            }


            const generateToken = this.tokenService.generateToken({ email: email, _id: checkUser._id }, { expiresIn: process.env.JWT_EXPIRES_IN, secret: process.env.JWT_SECRET })

            return { message: "User logged in successfully", generateToken }

        } catch (error) {
            throw new ConflictException('Error', error.message)
        }
    }

}