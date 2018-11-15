import {isEmpty, isValidEmail} from "./StringUtils";
import {languageSelect, tr} from "../res";

function checkEmpty(fieldName, value) {
  if (isEmpty(value)) {
    return languageSelect({
      any: `* ${fieldName} must not be empty`,
      vi:`* ${fieldName} không được để trống`,
    });
  } else {
    return null;
  }
}

function checkAddress(address) {
  if (!address || isEmpty(address.displayName)) {
    return languageSelect({
      any: "* Address must be selected",
      vi: "* Phải chọn địa chỉ",
    });
  } else {
    return null;
  }
}

function checkEmail(email) {
  if (email && !isValidEmail(email)) {
    return languageSelect({
      any: "* Email is invalid",
      vi: "* Email không hợp lệ",
    });
  } else {
    return null;
  }
}

function checkCategory(category) {
  if (isEmpty(category)) {
    return languageSelect({
      any: "* Category must be picked",
      vi: "* Phải phân loại nơi này",
    });
  } else {
    return null;
  }
}

export function validateInput(categories, name, description, address, email) {
  return {
    categories: checkCategory(categories),
    name: checkEmpty(tr('input_validation_util_name'), name),
    description: checkEmpty(tr('input_validation_util_description'), description),
    address: checkAddress(address),
    phone: null, // not check so far
    website: null, // not check so far
    email: checkEmail(email), // not check so far,
  };
}
