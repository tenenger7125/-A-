import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { getBaseUrl } from '@/lib/get-api-url';

export const worker = setupWorker(...handlers(getBaseUrl()));
