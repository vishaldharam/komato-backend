import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';
export const AuthType = (
  type: 'CUSTOMER' | 'ADMIN' | 'RESTAURANT' | 'DELIVERY',
) => SetMetadata(AUTH_TYPE_KEY, type);
