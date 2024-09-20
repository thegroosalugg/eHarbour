exports.trimBody = (data) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.trim()]));
