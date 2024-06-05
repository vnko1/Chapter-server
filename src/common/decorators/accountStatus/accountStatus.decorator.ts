import { Reflector } from '@nestjs/core';

export const AccountStatus = Reflector.createDecorator<string[]>();
