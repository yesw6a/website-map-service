import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { createCors } from 'itty-router';

import { DevInitCF } from './endpoints/dev-init-cf';
import { WebList } from './endpoints/web-list';

export const router = OpenAPIRouter({
  docs_url: '/',
  openapi_url: '/website-map',
  schema: {
    info: {
      title: 'Website Map API',
      version: '1.0.0',
    },
  },
});
const { preflight, corsify } = createCors();

router.all('*', preflight);
router.get('/api/dev/init', DevInitCF);
router.get('/api/webs/', WebList);

// 404 for everything else
router.all('*', () =>
  Response.json(
    {
      success: false,
      error: 'Route not found',
    },
    { status: 404 },
  ),
);

export default {
  fetch: async (request: Request, env: Env, ctx: any) => {
    return router.handle(request, env, ctx).then(corsify);
  },
};
