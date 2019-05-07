 import { ajaxLoading, modal, tips, listStateChange } from 'components'
 import { key, ajaxConfig } from 'config'

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
     confirmTitle: undefined,
     url: '',
     urlAuto: true,
     type: 'POST',
     contentType: 'application/x-www-form-urlencoded',
     data: {},
     dataType: undefined,
     context: undefined,
     processData: false, //序列化数据,formdata的时候需要false
     success: undefined,
     fail: undefined,
     complete: undefined
   }
   constructor(urlHead, tokenKey) {
     this.urlHead = urlHead
     this.tokenKey = tokenKey
   }
   confirm(callback) {
     if (this.config.confirmTitle) {
       modal({
         title: '确认',
         content: this.config.confirmTitle,
         success: () => {
           callback && callback()
         }
       })
     } else {
       callback && callback()
     }
   }
   lock(callback) {
     if (this.config.id) {
       if (!this.temp[this.config.id]) {
         callback && callback()
       }
     } else {
       callback && callback()
     }
   }
   send(options) {
     this.config = $.extend({
       hasLoading: false,
       url: '',
       urlAuto: true,
       type: 'POST',
       contentType: 'application/x-www-form-urlencoded',
       data: {},
       processData: false,
     }, options)
     this.config.url = this.config.urlAuto ? this.urlHead + this.config.url : this.config.url
     delete this.config.urlAuto
     if (this.config.id) {
       this.lock(confirm(request()))
     } else {
       this.lock(confirm(request()))
     }
   }
   request() {
     if (this.config.hasLoading) {
       ajaxLoading.show(ajaxConfig.loadingText);
     }
     $.ajax({
       url: this.config.url,
       type: this.config.type,
       headers: this.config.headers,
       contentType: this.config.contentType,
       data: this.config.data,
       dataType: this.config.dataType,
       context: this,
       processData: this.config.processData,
       complete: (XHR, TS) => {
         delete this.temp[this.config.id]
         if (this.config.hasLoading) {
           ajaxLoading.hide();
         }
         if (XHR.status === 200) {
           if (XHR.responseJSON && XHR.responseJSON.code === 0) {
             this.config.success(XHR.responseJSON);
           } else {
             this.config.fail(XHR.responseJSON);
           }
         } else {
           tips("网络错误，请稍后再试");
           this.config.fail();
         }
         this.config.complete(XHR.responseJSON)
       }
     });
   }
 }
 const ajax = new Ajax(ajaxConfig.urlHead, key.tokenKey)


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
   changeData(data){
    this.config.data=$.extend(true,this.config.data,data)
   }
   delData(name){
    delete this.config.data[name]
   }
   changeURL(url){
    this.config.url = url
   }
   refreshPage(){
    this.config.listState = 0
    this.config.pageIndex = 0
    this.send()
   }
 }