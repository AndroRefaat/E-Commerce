import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { TokenService } from "../service/token";
import { UserRepositoryService } from "src/DB/Repository/user.repository";
import { UserDocument } from "src/DB/models/user.model";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private readonly userRepositoryService: UserRepositoryService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {

            if (context['contextType'] == 'http') {
                const request = context.switchToHttp().getRequest();
                const authHeader = request.headers['authorization'];
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    throw new UnauthorizedException('Access token is required');
                }
                const accessToken = authHeader.split(' ')[1];
                const data = this.tokenService.verifyToken(accessToken, {
                    secret: process.env.JWT_SECRET,
                });
                const user = await this.userRepositoryService.findOne({
                    _id: data._id,
                });
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                request.user = user;
            } else if (context['contextType'] == 'graphql') {
                const request = GqlExecutionContext.create(context).getContext().req;
                const authHeader = request.headers['authorization'];
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    throw new UnauthorizedException('Access token is required');
                }
                const accessToken = authHeader.split(' ')[1];
                const data = this.tokenService.verifyToken(accessToken, {
                    secret: process.env.JWT_SECRET,
                });
                const user = await this.userRepositoryService.findOne({
                    _id: data._id,
                });
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                request.user = user;
            }
            return true;
        } catch (error) {
            if (
                error instanceof UnauthorizedException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
