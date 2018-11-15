import {isEmpty} from "./StringUtils";

export function hasUserId(query) {
  return (query.id !== -1) && !!query.userId;
}

export function hasCategoryId(query) {
  return typeof(query.id) === 'number' && query.id > -1;
}

export function hasKeyword(query) {
  return query.keyword && !isEmpty(query.keyword);
}
