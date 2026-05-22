// instrumentation.ts
export async function register() {
  console.log('[instrumentation] 실행됨, NEXT_RUNTIME:', process.env.NEXT_RUNTIME);
  console.log('[instrumentation] API_MOCKING:', process.env.NEXT_PUBLIC_API_MOCKING);

  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    try {
      console.log('[MSW] import 시작');
      const { server } = await import('./mock/server');
      console.log('[MSW] import 성공');
      server.listen({ onUnhandledRequest: 'bypass' });
      console.log('[MSW] Node server started');
    } catch (e) {
      console.error('[MSW] 실패:', e);
    }
  }
}
