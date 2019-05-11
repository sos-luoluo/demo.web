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
     return new Promise((resolve,reject)=>{
      if(config.id&&this.temp[id]){
        reject({
          msg: '加载中，请稍后'
        })
        return
      }
      this.confirm(config.confirmText,()=>{
        if (config.hasLoading) {
          ajaxLoading.show(ajaxConfig.loadingText);
        }
        $.ajax(config.url,{
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
                resolve(XHR.responseJSON)
              } else {
                reject(XHR.responseJSON)
              }
            } else {
              tips("网络错误，请稍后再试");
              reject({
                msg: "网络错误，请稍后再试"
              })
            }
          }
        });
      })
     })
   }
 }
 export const ajaxMain=new Ajax(ajaxConfig.urlHead, key.tokenKey)
 export const ajax=(options)=>{return ajaxMain.request(options)} 

 /**
  * 列表请求方法
  * @constructor
  * @param {object} options 配置
  */
 export class ListAjax {
   listState = 0
   pageTotal = 0
   config = {
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
     pageIndex: 0,
     pageSize: 10
   }
   constructor(options) {
     this.config = $.extend({
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
       pageIndex: 0,
     }, options)
     this.bindEvent()
   }
   send(pageIndex) {
     if (this.listState !== 0) {
       return
     }
     this.listState = 1
     listStateChange(this.config.el, 1)
     if (pageIndex && pageIndex <= this.pageTotal) {
       this.config.pageIndex = pageIndex
     } else {
       this.config.pageIndex++
     }
     ajax.send({
       id: this.config.el,
       hasLoading: this.config.hasLoading,
       urlAuto: this.config.urlAuto,
       url: this.config.url,
       type: this.config.type,
       data: $.extend({
         current: this.config.pageIndex,
         size: this.config.pageSize
       }, this.config.data),
       dataType: this.config.dataType,
       success: function(res) {
         this.config.pageTotal = res.data.pages
         listStateChange(this.config.el, 0)
         if (this.config.pageTotal === 0) {
           this.listState = 2
         } else if (this.config.pageTotal === this.config.pageIndex) {
           this.listState = 3
         } else {
           this.listState = 0
         }
         if (res.data.records.length > 0) {
           var result = ""
           if (this.config.result) {
             result = this.config.result(res.data.records)
           }
           if (this.config.pageIndex === 1) {
             $(this.config.el).html(result)
           } else {
             $(this.config.el).append(result)
           }
         }
         listStateChange(setting.listState, this.config.el)
         if (this.config.success) {
           this.config.success(res)
         }
       },
       fail: function(res) {
         this.listState = 0
         listStateChange.changeListState(this.listState, setting.el)
         if (this.config.fail) {
           this.config.fail(res)
         }
       },
       complete: function(res) {
         if (this.config.once) {
           this.config.once(res)
           delete this.config.once
         }
         if (this.config.complete) {
           this.config.complete(res)
         }
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
     this.config.pageIndex = 0
     this.send()
   }
 }