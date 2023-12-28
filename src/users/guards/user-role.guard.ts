import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";
import { META_ROLES } from "../decorators/role-protected.decorator";
import { ValidRoles } from "../interfaces/validRoles";


@Injectable()
export class UseUserTypeGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {

        const validRoles: ValidRoles[] = this.reflector.get(META_ROLES, context.getHandler())

        if (!validRoles || validRoles.length === 0) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as User;

        if (!user)
            throw new BadRequestException('User not found');

        for (const role of user.roles) {
            if (validRoles.some(permitirRoles => permitirRoles.includes(role))) {
                return true;
            }
        }
        throw new ForbiddenException(`User ${user.username} need a valid role: [${validRoles}]`)
    }

}