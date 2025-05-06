
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleTypes } from '../types/types';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ref } from 'process';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<RoleTypes[]>("roles", context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        if (context['contextType'] == 'graphql') {
            const request = GqlExecutionContext.create(context).getContext();
            const { user } = request.req;

            if (!requiredRoles.includes(user.role)) {
                throw new BadRequestException('Unauthorized');
            }
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!requiredRoles.includes(user.role)) {
            throw new BadRequestException('Unauthorized');
        }

        return true;
    }

}
