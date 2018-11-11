const images = {
  aborted: require('./images/aborted.png'),
  completed: require('./images/completed.png'),
  failed: require('./images/failed.png'),
  facebook: require('./images/facebook.png'),
  anonymous: require('./images/anonymous.png'),
};

const I18n = require("react-native-i18n");
I18n.fallbacks = true;
I18n.translations = {
  en: require("./strings/en"),
  vi: require("./strings/vi"),
};

I18n.t = (string) => {
    const localString = I18n.translations.vi[string];

    return localString ? localString : string;
};

module.exports = {
  I18n,
  images,
};
