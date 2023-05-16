import { SetMetadata } from '@nestjs/common';
import { Role } from '../entity/Role.entity';


export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);
