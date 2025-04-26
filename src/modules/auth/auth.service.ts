import { ConflictException, Injectable } from "@nestjs/common";
import { ConfirmEmailtDTO, CreateAccountDTO, LoginDTO } from "./dto/auth.dto";
import { UserRepositoryService } from '../../DB/Repository/user.repository';
import { sendEmail } from "src/common/email/sendEmail";
import { TokenService } from "src/common/service/token";
import { CompareHash, Hash } from "src/common/security/Hash";
import { OTPTypes, RoleTypes } from "src/common/types/types";
import { OTPRepositoryService } from "src/DB/Repository/otp.repository";
import { generateOTPTemplate } from "src/common/email/template";



@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userRepositoryService: UserRepositoryService,
        private readonly tokenService: TokenService,
        private readonly OTPRepositoryService: OTPRepositoryService
    ) { }

    async signup(body: CreateAccountDTO) {
        try {
            const { email, password, firstName, lastName, DOB, address, phone, role } = body;
            const checkUser = await this.userRepositoryService.findOne({ filter: { email } })
            if (checkUser) {
                throw new ConflictException('User already exists')
            }
            const user = await this.userRepositoryService.create({
                email,
                password,
                firstName,
                lastName,
                DOB,
                address,
                phone,
                role: role as RoleTypes
            })


            const OTPCode = Math.floor(100000 + Math.random() * 900000).toString()
            this.OTPRepositoryService.createOTP({
                otp: Hash(OTPCode),
                userId: user._id,
                otpTypes: OTPTypes.confirmation,
            })

            const emailHTML = generateOTPTemplate(OTPCode);
            await sendEmail({ to: email, subject: 'Welcome to our service', html: emailHTML })

            return { message: "User created successfully", user }
        } catch (error) {
            throw new ConflictException('Erorr', error.message)
        }
    }


    async confirmEmail(body: ConfirmEmailtDTO) {
        try {
            const { email, otp } = body;
            const checkUser = await this.userRepositoryService.findOne({ email, confirmEmail: false })
            if (!checkUser) {
                throw new ConflictException('User not exists')
            }

            const checkOTP = await this.OTPRepositoryService.findOne({ userId: checkUser._id, otpTypes: OTPTypes.confirmation })
            if (!checkOTP) throw new ConflictException('OTP not exists')
            if (!CompareHash(otp, checkOTP.otp)) {
                throw new ConflictException('OTP is incorrect')
            }

            if (new Date() > checkOTP.expiredAt) {
                throw new ConflictException('OTP is expired')
            }

            await this.userRepositoryService.findOneAndUpdate({ _id: checkUser._id }, { confirmEmail: true })
            await this.OTPRepositoryService.findOneAndDelete({ _id: checkOTP._id })

            return { message: "Email confirmed successfully" }
        } catch (error) {
            throw new ConflictException('Erorr', error.message)
        }
    }


    async login(body: LoginDTO) {
        try {
            const { email, password } = body;
            const checkUser = await this.userRepositoryService.findOne({ email })
            if (!checkUser) {
                throw new ConflictException('User does not exist')
            }
            if (!CompareHash(password, checkUser.password)) {
                throw new ConflictException('Invalid password')
            }


            const access_token = this.tokenService.generateToken({ email: email, _id: checkUser._id }, { expiresIn: process.env.ACCESS_EXPIRES_IN, secret: process.env.JWT_SECRET })

            const refresh_token = this.tokenService.generateToken({ email: email, _id: checkUser._id }, { expiresIn: process.env.REFRESH_EXPIRES_IN, secret: process.env.JWT_SECRET })

            return { message: "User logged in successfully", access_token, refresh_token }

        } catch (error) {
            throw new ConflictException('Error', error.message)
        }
    }

}