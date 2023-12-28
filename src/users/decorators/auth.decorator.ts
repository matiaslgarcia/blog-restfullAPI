import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces/validRoles';
import { RoleProtected } from './role-protected.decorator';
import { UseUserTypeGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(
            AuthGuard(),
            UseUserTypeGuard
        )
    );
}