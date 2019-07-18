import md5 from './md5'
import {
  SECRET_KEY
} from './config'

const ksort = (inputArr) => {
  let tmp_arr = {},
    keys = [],
    sorter,
    i,
    k,
    strictForIn = false,
    populateArr = {};
  sorter = (a, b) => {
    var aFloat = parseFloat(a),
      bFloat = parseFloat(b),
      aNumeric = aFloat + '' === a,
      bNumeric = bFloat + '' === b;
    if (aNumeric && bNumeric) {
      return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
    } else if (aNumeric && !bNumeric) {
      return 1;
    } else if (!aNumeric && bNumeric) {
      return -1;
    }
    return a > b ? 1 : a < b ? -1 : 0;
  };

  // Make a list of key names
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      keys.push(k);
    }
  }
  keys.sort(sorter);
  // Rebuild array with sorted key names
  for (i = 0; i < keys.length; i++) {
    k = keys[i];
    tmp_arr[k] = inputArr[k];
    if (strictForIn) {
      delete inputArr[k];
    }
  }
  for (i in tmp_arr) {
    if (tmp_arr.hasOwnProperty(i)) {
      populateArr[i] = tmp_arr[i];
    }
  }
  return strictForIn || populateArr;
}

// 处理对应后台 签名
export const encryption = (data = {}) => {
  let queryStr = '';
  data.time = (new Date().getTime()).toString();

  data.sig_key = SECRET_KEY;

  data = ksort(data);

  for (let i in data) {
    if (data[i] == undefined || data[i] == '') {
      data[i] = null;
    }
    queryStr += i + '=' + data[i] + '&';
  }
  return ({
    sig_key: data.sig_key,
    time: data.time,
    signature: md5(data.sig_key.substr(3, data.sig_key.length) + queryStr.substr(0, queryStr.length - 1) + data.sig_key.substr(data.sig_key.length - 5, data.sig_key.length))
  });
};
