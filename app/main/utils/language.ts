import { app } from 'electron';
import { menuBuilder, store } from '../components/singletons';
import { LanguageEnum } from '../types/enum';
import i18n from '../i18n';

export const setLanguage = async () => {
  let language = store.get('language');
  if (language === LanguageEnum.system) {
    language = app.getLocale();
  }
  await i18n.changeLanguage(language as string);
  menuBuilder.buildMenu();
};
