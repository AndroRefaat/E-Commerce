import { Optional } from "@nestjs/common";
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength, Validate, ValidateIf } from "class-validator";
import { confirmPassword } from "src/common/decorators/password.custom";



export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

}

export class CreateAccountDTO {
    // @IsString({ message: "Username must be a string" })
    // @MinLength(3)
    // @MaxLength(20)
    // @Optional()
    // username: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;


    @IsStrongPassword()
    password: string;

    @ValidateIf((args) => args.password)
    @Validate(confirmPassword)
    confirmPassword: string;
}