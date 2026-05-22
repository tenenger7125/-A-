import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { getBaseUrl } from '@/lib/get-api-url';

export const server = setupServer(...handlers(getBaseUrl()));
