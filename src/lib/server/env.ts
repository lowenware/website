import { env } from '$env/dynamic/public';

export const inquiryApiUrl = env.PUBLIC_INQUIRY_API_URL ?? 'https://my.lowenware.com/api/inquiry';
