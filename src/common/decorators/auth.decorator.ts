
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/authentication.guard';
import { RolesGuard } from '../guards/authorization.guard';
import { RoleTypes } from '../types/types';

export function Auth(...roles: RoleTypes[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, RolesGuard),
    );
}
