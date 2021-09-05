const { search } = location;
const params = search
  .replace('?', '')
  .split('&')
  .map((string) => string.split('='))
  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

export default params;