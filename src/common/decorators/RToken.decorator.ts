import { SetMetadata } from '@nestjs/common';

export const REFRESH_TOKEN = 'refresh_token';
export const RToken = () => SetMetadata(REFRESH_TOKEN, REFRESH_TOKEN);
