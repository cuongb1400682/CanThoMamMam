import {isEmpty, isValidEmail} from "./StringUtils";

function checkEmpty(fieldName, value) {
  if (isEmpty(value)) {
    return `* ${fieldName} must not be empty`;
  } else {
    return null;
  }
}

function checkAddress(address) {
  if (!address || isEmpty(address.displayName)) {
    return "* Address must be selected";
  } else {
    return null;
  }
}

function checkEmail(email) {
  if (email && !isValidEmail(email)) {
    return "* Email is invalid";
  } else {
    return null;
  }
}

function checkCategory(category) {
  if (isEmpty(category)) {
    return "* Category must be picked";
  } else {
    return null;
  }
}

export function validateInput(categories, name, description, address, email) {
  return {
    categories: checkCategory(categories),
    name: checkEmpty("Name", name),
    description: checkEmpty("Description", description),
    address: checkAddress(address),
    phone: null, // not check so far
    website: null, // not check so far
    email: null, // not check so far,
  };
}
