import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type SelectColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
type SelectPropertyResponse = {
  id: string;
  name: string;
  color: SelectColor;
};

export const getNotionValue = (
  properties: PageObjectResponse['properties'][keyof PageObjectResponse['properties']],
) => {
  let value: string | SelectPropertyResponse | Array<SelectPropertyResponse> = '';

  switch (properties.type) {
    case 'rich_text':
      value = properties.rich_text[0]?.plain_text;
      break;
    case 'title':
      value = properties.title[0]?.href;
      break;
    case 'select':
      value = properties.select;
      break;
    case 'multi_select':
      value = properties.multi_select;
      break;
    case 'files':
      switch (properties.files[0].type) {
        case 'file':
          value = properties.files[0].file?.url;
          break;
        case 'external':
          value = properties.files[0].external?.url;
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }

  return value;
};
