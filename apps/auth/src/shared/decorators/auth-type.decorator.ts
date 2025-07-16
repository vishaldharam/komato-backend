import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';
export const AuthType = (
  type: 'CUSTOMER' | 'ADMIN' | 'RESTAURANT_OWNER' | 'DELIVERY_BOY',
) => SetMetadata(AUTH_TYPE_KEY, type);
