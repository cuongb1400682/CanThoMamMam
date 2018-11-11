
export function extractInfo(items) {
  let res = [];
  items.forEach(item => {
    res.push({
      userId: item.user.id,
      category: item.category,
      name: item.name,
    });
  });
  return res;
}
