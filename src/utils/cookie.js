/**
 * 缓存存取方法
 * @overview cookie和localStorage操作方法
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * cookie操作方法
 * @property {function} set 设置方法
 * @property {function} get 获取方法
 * @property {function} del 删除方法
 */
const cookie = {
  /**
   * 设置cookie操作方法
   * @property {string} key key
   * @property {any} value 值
   * @property {number} time 过期时间
   */
  set: function(key, value, time) {
    if (time !== 0) {
      const expires = time * 1000;
      const date = new Date(new Date().getTime() + expires);
      document.cookie =
        key + "=" + escape(value) + ";expires=" + date.toUTCString();
    } else {
      document.cookie = key + "=" + escape(value);
    }
  },
  /**
   * 获取cookie操作方法
   * @property {string} key key
   */
  get: function(key) {
    let arr,
      reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  /**
   * 删除cookie操作方法
   * @property {string} key key
   */
  del: function(key) {
    const time = new Date(1000);
    const value = this.get(key);
    if (value != null) {
      document.cookie = key + "=" + value + ";expires=" + time.toGMTString();
    }
  }
};

/**
 * localStorage操作方法
 * @property {function} set 设置方法
 * @property {function} get 获取方法
 * @property {function} del 删除方法
 * @property {function} clear 清除方法
 */
const localStorage = {
  /**
   * 设置localStorage操作方法
   * @property {string} key key
   * @property {any} value 值
   */
  set: function(key, value) {
    const storage = window.localStorage;
    storage && storage.removeItem(key);
    storage && storage.setItem(key, value);
  },
  /**
   * 获取localStorage操作方法
   * @property {string} key key
   */
  get: function(key) {
    const storage = window.localStorage;
    return storage && storage.getItem(key);
  },
  /**
   * 删除localStorage操作方法
   * @property {string} key key
   */
  del: function(key) {
    const storage = window.localStorage;
    storage && storage.removeItem(key);
  },
  /**
   * 清空localStorage操作方法
   */
  clear: function() {
    const storage = window.localStorage;
    storage.clear();
  }
};
