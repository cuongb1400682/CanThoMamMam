export function isEmpty(str) {
  return (typeof(str) === 'string') && (str.length === 0 || str.trim().length === 0);
}

export function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return isEmpty(email) || re.test(email);
}

// this function converts strings like "helloFromEspana" or "hello_from_espana" to "Hello From Espana"
export function convertToCapitalizedText(text) {
  let result = text.charAt(0).toUpperCase();
  for (let i = 1; i < text.length; i++) {
    let prevChar = text.charAt(i - 1);
    let char = text.charAt(i);
    if (char === "_" || char === "-") {
      continue;
    }
    if (char === char.toUpperCase()) {
      result += " ";
    }
    if (prevChar === "_" || prevChar === "-") {
      result += " ";
      char = char.toUpperCase();
    }
    result += char;
  }
  return result;
}
