 import { ajaxLoading, modal, tips, listStateChange } from './components'
 import { key, ajaxConfig } from './config'

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
  * @param {object} urlHead 配置
  */
 class Ajax {
   temp = {}
   urlHead = undefined
   tokenKey = undefined
   config = {
     id: undefined,
     hasLoading: false,
     confirmText: undefined,
     url: '',
     urlAuto: true,
     type: 'POST',
     contentType: 'application/x-www-form-urlencoded',
     data: {},
     dataType: undefined,
     context: undefined,
     processData: true, //序列化数据,formdata的时候需要false
   }
   constructor(urlHead, tokenKey) {
     this.urlHead = urlHead
     this.tokenKey = tokenKey
   }
   confirm(confirmText, callback) {
     if (confirmText) {
       modal({
         title: '确认',
         content: confirmText,
         success: () => {
           callback && callback()
         }
       })
     } else {
       callback && callback()
     }
   }
   lock(id, callback) {
     if (id) {
       if (!this.temp[id]) {
         callback && callback()
       }
     } else {
       callback && callback()
     }
   }
   request(options) {
     const config = $.extend({}, this.config, options)
     config.url = config.urlAuto ? this.urlHead + config.url : config.url
     delete config.urlAuto
     return new Promise((resolve, reject) => {
       if (config.id && this.temp[config.id]) {
         reject({
           msg: '加载中，请稍后'
         })
         return
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
             delete this.temp[config.id]
             if (config.hasLoading) {
               ajaxLoading.hide();
             }
             if (XHR.status === 200) {
               if (XHR.responseJSON && XHR.responseJSON.code === 0) {
                 config.success && config.success(XHR.responseJSON)
                 resolve(XHR.responseJSON)
               } else {
                 config.fail && config.fail(XHR.responseJSON)
                 reject(XHR.responseJSON)
               }
             } else {
               tips("网络错误，请稍后再试");
               reject({
                 msg: "网络错误，请稍后再试"
               })
             }
             config.complete && config.complete(XHR.responseJSON)
           }
         });
       })
     })
   }
 }
 export const ajaxMain = new Ajax(ajaxConfig.urlHead, key.tokenKey)
 export const ajax = (options) => { return ajaxMain.request(options) }

 /**
  * 列表请求方法
  * @constructor
  * @param {object} options 配置
  */
 export class ListAjax {

   constructor(options) {
     this.listState = 0
     this.pageTotal = 1

     this.config = $.extend({
       id: options.el,
       el: '#list',
       scrollBox: 'body',
       hasLoading: false,
       urlAuto: true,
       url: '',
       data: {},
       dataType: 'json',
       type: 'POST',
       success: undefined,
       fail: undefined,
       complete: undefined,
       current: 0,
       size: 10
     }, options)

     this.bindEvent()
   }
   send(current) {
     if (this.listState !== 0) {
       return
     }
     this.listState = 1
     listStateChange(this.config.el, 1)
     if (current && current <= this.pageTotal) {
       this.config.current = current
     } else {
       this.config.current++
     }
     ajax({
       hasLoading: this.config.hasLoading,
       urlAuto: this.config.urlAuto,
       url: this.config.url,
       type: this.config.type,
       data: $.extend({
         current: this.config.current,
         size: this.config.size
       }, this.config.data),
       dataType: this.config.dataType,
       complete: (res) => {
         if (this.config.once) {
           this.config.once(res)
           delete this.config.once
         }
         if (this.config.complete) {
           this.config.complete(res)
         }
       }
     }).then((res) => {
       this.pageTotal = res.data.pages
       listStateChange(this.config.el, 0)
       if (this.pageTotal === 0) {
         this.listState = 2
       } else if (this.pageTotal === this.config.current) {
         this.listState = 3
       } else {
         this.listState = 0
       }
       if (res.data.records.length > 0) {
         var result = ""
         if (this.config.result) {
           result = this.config.result(res.data.records)
         }
         if (this.config.current === 1) {
           $(this.config.el).html(result)
         } else {
           $(this.config.el).append(result)
         }
       }
       listStateChange(this.config.el,this.listState)
       if (this.config.success) {
         this.config.success(res)
       }
     }).catch((res) => {
       this.listState = 0
       listStateChange(this.config.el,this.listState)
       if (this.config.fail) {
         this.config.fail(res)
       }
     })
   }
   bindEvent() {
     $(this.config.scrollBox).scroll((e) => {
       if ($(this.config.el).find(":last").isOnScreen()) {
         this.send()
       }
     })
   }
   changeData(data) {
     this.config.data = $.extend(true, this.config.data, data)
   }
   delData(name) {
     delete this.config.data[name]
   }
   changeURL(url) {
     this.config.url = url
   }
   refreshPage() {
     this.config.listState = 0
     this.config.current = 0
     this.send()
   }
 }