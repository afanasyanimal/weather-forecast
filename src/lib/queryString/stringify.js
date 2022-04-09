import _ from 'lodash';

export const stringify = (obj = {}) => {
  const pairs = [];

  _.forOwn(obj, (value, key) => {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });

  return pairs.length ? pairs.join('&') : '';
};
