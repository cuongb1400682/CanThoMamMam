export function groupBy(collection, property) {
  let i, val, key, result = {};
  for (i = 0; i < collection.length; i++) {
    if (typeof(property) === 'function') {
      key = property(collection[i]);
    } else {
      key = property;
    }

    val = collection[i][key];

    if (result[key]) {
      result[key].push(val);
    } else {
      result[key] = [];
    }
  }
  return result;
}

export function commentComparator(a, b) {
  if (a.created_timestamp > b.created_timestamp) {
    return -1;
  } else if (a.created_timestamp < b.created_timestamp) {
    return 1;
  } else {
    return 0;
  }
}
