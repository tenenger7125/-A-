export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
};

export const getApiUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
};
