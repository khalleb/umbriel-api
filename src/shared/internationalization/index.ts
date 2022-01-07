import { get, isEmpty } from 'lodash';

import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

interface IObjectKeys {
  [key: string]: any;
}

const locales: IObjectKeys = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

export function i18n(
  path: string,
  params?: { [key: string]: string },
  locale = globalThis?.__LOCALE_I18N__ || 'pt-BR',
): string {
  if (!locale) {
    return 'i18n - LOCALE NOT FOUND';
  }
  if (!path) {
    return path;
  }
  let label: string = get(locales[locale], path);
  if (!label) {
    return `${path} | i18n - LABEL NOT FOUND`;
  }
  if (params && !isEmpty(params)) {
    Object.keys(params)?.forEach(key => {
      label = label?.replace(`{${key}}`, params[key]);
    });
  }
  return label;
}
