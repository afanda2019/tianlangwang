import {
  API_URL
} from './config'
import {
  encryption
} from './data-encryption'
import {qqMapTransBMap} from "./conversion";

/**
 * 跳转
 * @param url 跳转地址
 * @param params 参数 json格式
 */
export function go(url, params = {}) {
  let queryStr = '?___key=' + Math.random() + '&';
  Object.keys(params).forEach(el => el != '___key' ? queryStr += `${el}=${params[el]}&` : '');
  url = `../${url}/main${queryStr.substr(0, queryStr.length - 1)}`;
  wx.navigateTo({
    url
  });
}

/**
 * 返回上一页
 */
export function back() {
  wx.navigateBack();
}

/**
 * AJAX
 * @param uri
 * @param params
 * @param header
 * @returns {Promise<any>}
 */
export async function wxAjax(uri, params = {}, header = {}) {

  let newParams = Object.assign({},  encryption(params)
    , params);
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_URL + uri,
      method: 'POST',
      header,
      data: newParams,
      success: res => {
        closeLoading();
        resolve(res.data)
      },
      error: err => {
        reject(err);
        closeLoading();
      }
    })
  })

}

/**
 * 加载loading
 * @param msg
 */
export const showLoading = (msg = '加载中') => wx.showLoading({
  title: msg,
  mask: true
});

/**
 * 关闭loading
 */
export const closeLoading = () => wx.hideLoading();

/**
 * 提示
 * @param msg
 * @param callback
 * @param duration
 * @returns {*}
 */

export const toast = (msg, callback, duration = 2000) => wx.showToast({
  title: msg,
  icon: 'none',
  duration,
  success: () => callback && callback()
});

/**
 * 设置缓存
 * @returns {*}
 */
export const setStorage = (key, data, cb) => wx.setStorage({
  key,
  data,
  success: () => cb && cb()
});

/**
 * 获取缓存
 * @returns {*}
 */
export const getStorage = key => wx.getStorageSync(key);

/**
 * 删除缓存
 * @param key
 * @returns {*}
 */
export const rmStorage = key => wx.removeStorageSync(key);


export const getBdLatitudeAndlongitude = (cb) => {

  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success(res) {
      let {latitude, longitude} = res;
      cb && cb(qqMapTransBMap(longitude, latitude));
    }
  })

}


