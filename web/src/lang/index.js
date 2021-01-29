// import { addLocaleData } from 'react-intl';
import enLang from './entries/en-US';
import koLang from './entries/ko-KR';

// import {createIntl, createIntlCache, RawIntlProvider} from 'react-intl'

// // This is optional but highly recommended
// // since it prevents memory leak
// const cache = createIntlCache()

// const intl = createIntl({
//   locale: 'fr-FR',
//   messages: {}
// }, cache)

const AppLocale = {
  en: enLang,
  ko: koLang,
};
// addLocaleData(AppLocale.en.data);
// addLocaleData(AppLocale.es.data);

export default AppLocale;
