import { Optional } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, Validate, ValidateIf } from "class-validator";
import { confirmPassword } from "src/common/decorators/password.custom";
import { GenderTypes, RoleTypes } from "src/common/types/types";



export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

}

export class CreateAccountDTO {
    @MinLength(3)
    @MaxLength(20)
    @IsString()
    firstName: string;

    @MinLength(3)
    @MaxLength(20)
    @IsString()
    lastName: string;

    @IsEmail()
    email: string;


    @IsStrongPassword()
    password: string;

    @ValidateIf((args) => args.password)
    @Validate(confirmPassword)
    confirmPassword: string;

    @IsEnum(RoleTypes)
    role: string

    @IsEnum(GenderTypes)
    gender: string

    @IsNotEmpty()
    @IsString()
    address: string

    @IsString()
    phone: string

    @IsDate()
    @Transform(({ value }) => new Date(value))
    DOB: Date
}



export class ConfirmEmailtDTO {

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string


}