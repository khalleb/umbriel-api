import { get } from 'lodash';

import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

interface IObjectKeys {
  [key: string]: any;
}

const locales: IObjectKeys = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

export function i18n(path: string, locale = global?.__LOCALE_I18N__ || 'pt-BR'): string {
  if (!locale) {
    return 'i18n - LOCALE NOT FOUND';
  }
  if (!path) {
    return path;
  }
  return get(locales[locale], path, `${path} | i18n - LABEL NOT FOUND`);
}

export function teste(): string {
  return '';
}
