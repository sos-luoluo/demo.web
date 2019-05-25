import { ajaxLoading, modal, tips, listStateChange } from "./components";
import { key, ajaxConfig } from "./config";
import { localStorage } from "./cookie";

/**
 * ajax请求二次封装
 * @overview 在jquery上二次封装的请求方法
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 通用请求方法
 * @overview 全局new一个即可
 * @constructor
 * @param {string} urlHead 请求头部配置
 * @param {string} tokenKey token配置
 */
class Ajax {
  /**
   * 用于缓存请求ID
   */
  temp = {};
  /**
   * 全局配置请求头部
   */
  urlHead = undefined;
  /**
   * 全局配置token
   */
  tokenKey = undefined;
  /**
   * 请求默认配置
   */
  config = {
    id: undefined,
    hasLoading: false,
    confirmText: undefined,
    headers: {},
    url: "",
    urlAuto: true,
    type: "POST",
    contentType: "application/x-www-form-urlencoded",
    data: {},
    dataType: undefined,
    context: undefined,
    processData: true
  };
  /**
   * 通用请求方法
   * 初始化的时候初始化全局请求固定的参数，如请求头部、tokenKey
   * @param {string} urlHead 请求头部配置
   * @param {string} tokenKey token配置
   */
  constructor(urlHead, tokenKey) {
      this.urlHead = urlHead;
      this.tokenKey = tokenKey;
    }
    /**
     * 确认弹窗
     * @param {string} confirmText 确认提示文字
     * @param {function} callback 回调函数
     */
  confirm(confirmText, callback) {
      if (confirmText) {
        modal({
          title: "确认",
          content: confirmText,
          success: () => {
            callback && callback();
          }
        });
      } else {
        callback && callback();
      }
    }
    /**
     * 判断请求是否锁定
     * @param {string} id 请求唯一ID
     * @param {function} callback 回调函数
     */
  lock(id, callback) {
      if (id) {
        if (!this.temp[id]) {
          callback && callback();
        }
      } else {
        callback && callback();
      }
    }
    /**
     * 发送请求方法
     * @param {object} options 配置
     * @param {string} id 需要锁定ajax请求时，请加入此参数
     * @param {boolean} hasLoading 是否开启loading
     * @param {string} confirmText 确认弹窗提示信息
     * @param {string} type 请求方式
     * @param {boolean} processData 是否序列化参数，formData需要关掉
     * @param {object} data 参数
     * @param {boolean} urlAuto 是否自动处理请求地址，可以用来处理特殊请求
     */
  request(options) {
    const config = $.extend({}, this.config, options);
    config.url = config.urlAuto ? this.urlHead + config.url : config.url;
    delete config.urlAuto;
    const token = localStorage.get(this.tokenKey);
    if (token) {
      config.headers[this.tokenKey] = token;
    }
    return new Promise((resolve, reject) => {
      if (config.id && this.temp[config.id]) {
        reject({
          msg: "加载中，请稍后"
        });
        return;
      }
      this.confirm(config.confirmText, () => {
        if (config.hasLoading) {
          ajaxLoading.show(ajaxConfig.loadingText);
        }
        $.ajax(config.url, {
          contentType: config.contentType,
          type: config.type,
          headers: config.headers,
          processData: false,
          data: config.data,
          dataType: config.dataType,
          context: undefined,
          processData: config.processData,
          complete: (XHR, TS) => {
            delete this.temp[config.id];
            if (config.hasLoading) {
              ajaxLoading.hide();
            }
            if (XHR.status === 200) {
              // 成功处理逻辑，可以按照项目实际需求进行修改
              if (XHR.responseJSON && XHR.responseJSON.code === 0) {
                config.success && config.success(XHR.responseJSON);
                resolve(XHR.responseJSON);
              } else {
                config.fail && config.fail(XHR.responseJSON);
                reject(XHR.responseJSON);
              }
            } else {
              tips("网络错误，请稍后再试");
              reject({
                msg: "网络错误，请稍后再试"
              });
            }
            config.complete && config.complete(XHR.responseJSON);
          }
        });
      });
    });
  }
}

export const ajaxMain = new Ajax(ajaxConfig.urlHead, key.tokenKey);
/**
 * 发送请求方法
 * @overview 传入配置信息。支持success、fail回调，同时也会返回一个Promise,所以支持then、catch写法。
 * @param {string} id 需要锁定ajax请求时，请加入此参数
 * @param {boolean} hasLoading 是否开启loading
 * @param {string} confirmText 确认弹窗提示信息
 * @param {string} type 请求方式
 * @param {boolean} processData 是否序列化参数，formData需要关掉
 * @param {object} data 参数
 * @param {boolean} urlAuto 是否自动处理请求地址，可以用来处理特殊请求
 */
export const ajax = options => {
  return ajaxMain.request(options);
};

/**
 * 列表请求方法
 * @constructor
 * @param {object} options 配置
 * @param {string} el 列表渲染的位置，一般是列表包裹层
 * @param {string} scrollBox 要监听滚动事件的元素
 */
export class ListAjax {
  /**
   * 列表请求方法
   * @constructor
   * @overview 传入配置信息后使用
   * @param {string} el 列表渲染的位置，一般是列表包裹层
   * @param {string} scrollBox 要监听滚动事件的元素
   * @param {boolean} hasLoading 是否有loading，每次均会生效
   * @param {boolean} urlAuto 是否自动处理url地址
   * @param {object} data 初始参数
   * @param {string} type 请求方式
   * @param {number} current 初始页码,0代表第一页
   * @param {number} size 列表大小
   */
  constructor(options) {
      this.listState = 0;
      this.pageTotal = 1;

      this.config = $.extend({
          id: options.el,
          el: "#list",
          scrollBox: "body",
          hasLoading: false,
          urlAuto: true,
          url: "",
          data: {},
          dataType: "json",
          type: "POST",
          success: undefined,
          fail: undefined,
          complete: undefined,
          current: 0,
          size: 10
        },
        options
      );

      this.bindEvent();
    }
  /**
   * 发送请求方法
   * @param {number} current 可选，页码
   */
  send(current) {
    if (this.listState !== 0) {
      return;
    }
    this.listState = 1;
    listStateChange(this.config.el, 1);
    if (current && current <= this.pageTotal) {
      this.config.current = current;
    } else {
      this.config.current++;
    }
    ajax({
      hasLoading: this.config.hasLoading,
      urlAuto: this.config.urlAuto,
      url: this.config.url,
      type: this.config.type,
      data: $.extend({
          current: this.config.current,
          size: this.config.size
        },
        this.config.data
      ),
      dataType: this.config.dataType,
      complete: res => {
        if (this.config.once) {
          this.config.once(res);
          delete this.config.once;
        }
        if (this.config.complete) {
          this.config.complete(res);
        }
      }
    })
    .then(res => {
      this.pageTotal = res.data.pages;
      listStateChange(this.config.el, 0);
      if (this.pageTotal === 0) {
        this.listState = 2;
      } else if (this.pageTotal === this.config.current) {
        this.listState = 3;
      } else {
        this.listState = 0;
      }
      if (res.data.records.length > 0) {
        var result = "";
        if (this.config.result) {
          result = this.config.result(res.data.records);
        }
        if (this.config.current === 1) {
          $(this.config.el).html(result);
        } else {
          $(this.config.el).append(result);
        }
      }
      listStateChange(this.config.el, this.listState);
      if (this.config.success) {
        this.config.success(res);
      }
    })
    .catch(res => {
      this.listState = 0;
      listStateChange(this.config.el, this.listState);
      if (this.config.fail) {
        this.config.fail(res);
      }
    });
  }
  /**
   * 绑定滚动事件，内部方法
   */
  bindEvent() {
    $(this.config.scrollBox).scroll(e => {
      if (
        $(this.config.el)
        .find(":last")
        .isOnScreen()
      ) {
        this.send();
      }
    });
  }
  /**
   * 新增或改变参数
   * @param {object} data 参数
   */
  changeData(data) {
    this.config.data = $.extend(true, this.config.data, data);
  }
  /**
   * 删除参数
   * @param {string} name 参数名
   */
  delData(name) {
    delete this.config.data[name];
  }
  /**
   * 改变请求url地址
   * @param {string} url 新的请求地址
   */
  changeURL(url) {
    this.config.url = url;
  }
  /**
   * 重置列表,列表状态
   */
  refreshPage() {
    this.config.listState = 0;
    this.config.current = 0;
    this.send();
  }
}
