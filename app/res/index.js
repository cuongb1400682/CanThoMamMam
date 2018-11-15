const I18n = require("react-native-i18n");
I18n.fallbacks = true;
I18n.translations = {
  en: require("./strings/en"),
  vi: require("./strings/vi"),
};

I18n.t = (string) => {
  if (string in I18n.translations.vi) {
    return I18n.translations.vi[string];
  } else {
    return string;
  }
};


export const getCurrentLanguage = () => "vi";

export function languageSelect(selection = {}) {
  return selection["vi"];
}

module.exports = {
  I18n,
  tr: I18n.t
};
