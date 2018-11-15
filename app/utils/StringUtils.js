export function isEmpty(str) {
  return (typeof(str) === 'string') && (str.length === 0 || str.trim().length === 0);
}

export function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return isEmpty(email) || re.test(email);
}

// this function converts strings like "helloFromEspana" or "hello_from_espana" to "Hello From Espana"
export function convertToCapitalizedText(text) {
  //return text.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  return text[0].toUpperCase() + text.substr(1,text.length-1);
}
