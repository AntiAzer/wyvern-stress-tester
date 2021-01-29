import { CHANGE_LOCALE } from '../actions';
import { setCurrentLanguage } from '../../helpers/Utils';

export const changeLocale = (locale) => {
  setCurrentLanguage(locale);
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
};
