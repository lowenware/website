import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  PUBLIC_INQUIRY_API_URL: { public: true, schema: (input) => input }
});
