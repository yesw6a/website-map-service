import { Arr, Bool, OpenAPIRoute, OpenAPIRouteSchema, Str } from '@cloudflare/itty-router-openapi';
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { getNotionValue } from '../utils';

export class WebList extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ['Webs'],
    summary: '网站列表',
    responses: {
      '200': {
        description: '返回网站列表',
        schema: {
          success: new Bool({ description: '是否成功' }),
          data: new Arr({
            id: new Str({ description: 'ID' }),
            name: new Str({ description: '网站名称' }),
            tags: new Arr({
              id: new Str({ description: '标签ID' }),
              name: new Str({ description: '标签文案' }),
              color: new Str({ description: '标签颜色' }),
            }),
            url: new Str({ description: '网址' }),
            url_2: new Str({ description: '网址2', required: false }),
            cover_url: new Str({ required: false, description: '封面图' }),
            description: new Str({ required: false, description: '描述' }),
            url_type: new Str({ required: false, description: '网址类型' }),
            url_2_type: new Str({ required: false, description: '网址2类型' }),
          }),
        },
      },
    },
  };

  async handle(request: Request, env: Env) {
    const [secret, websiteDbId] = await Promise.all([
      env.WEBSITE_MAP_NOTION.get('secret'),
      env.WEBSITE_MAP_NOTION.get('website_db_id'),
    ]);
    const notion = new Client({ auth: secret });
    const webs = await notion.databases.query({
      database_id: websiteDbId,
    });
    const list = (webs.results as PageObjectResponse[]).map(({ id, properties }) => ({
      id,
      name: getNotionValue(properties['网站名']),
      cover_url: getNotionValue(properties['封面']),
      tags: getNotionValue(properties['标签']),
      url: getNotionValue(properties['URL']),
      url_type: getNotionValue(properties['URL类型']),
      url_2: getNotionValue(properties['URL2']),
      url_2_type: getNotionValue(properties['URL2类型']),
      description: getNotionValue(properties['描述']),
    }));

    return {
      success: true,
      data: list,
    };
  }
}
