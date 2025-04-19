/* eslint-disable prettier/prettier */
import { Body, Controller, Get, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { CreateAccountDTO, LoginDTO } from './dto/auth.dto';
import { PasswordPipe } from 'src/common/pipes/custom.pipe';
import { registerSchema } from './auth.validation.schema';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';


@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }

    @Post('signup')
    signup(@Body() body: CreateAccountDTO) {
        return this.authenticationService.signup(body)
    }

    @Post('login')
    login(@Body() body: LoginDTO) {
        return this.authenticationService.login(body)
    }


    @Get('profile')
    @UseGuards(AuthGuard)
    getProfile(@Req() req: Request) {
        const user = req['user'];
        return user;
    }

}
