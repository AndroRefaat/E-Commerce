/* eslint-disable prettier/prettier */
import { Body, Controller, Get, ParseIntPipe, Patch, Post, Req, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { ConfirmEmailtDTO, CreateAccountDTO, LoginDTO } from './dto/auth.dto';
import { PasswordPipe } from 'src/common/pipes/custom.pipe';
import { registerSchema } from './auth.validation.schema';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { RoleTypes } from 'src/common/types/types';
import { Auth } from 'src/common/decorators/auth.decorator';


@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }

    @Post('signup')
    signup(@Body() body: CreateAccountDTO) {
        return this.authenticationService.signup(body)
    }

    @Patch('confirmEmail')
    confirmEmail(@Body() body: ConfirmEmailtDTO) {
        return this.authenticationService.confirmEmail(body)
    }


    @Post('login')
    login(@Body() body: LoginDTO) {
        return this.authenticationService.login(body)
    }


    @Auth(RoleTypes.admin, RoleTypes.user)
    @Get('profile')
    getProfile(@Req() req: Request) {
        const user = req['user'];
        return user;
    }

}
