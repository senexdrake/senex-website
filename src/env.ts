import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ RESOLVE_LINKS: { static: true } });
