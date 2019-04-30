 /**
  * 项目常用组件
  * @overview 常用组件
  * @author [luoluo]
  * @version 2.0.0
  */


 /**
  * 页面loading
  * @property {string} html 字符串模板
  * @property {function} show 显示
  * @property {function} hide 隐藏
  */
 export const pageLoading = {
   html: '<div class="pageloading" id="pageloading"><div class="loding-box"><div class="icon-box"></div></div></div>',
   show() {
     const $dom = $("#pageloading");
     if ($dom.length > 0) {
       $dom.show();
     } else {
       $("body").append(this.html);
     }
   },
   hide() {
     $("#pageloading").hide();
   }
 }

 /**
  * ajax loading
  * @property {string} html 字符串模板
  * @property {function} show 显示
  * @property {function} hide 隐藏
  */
 export const ajaxLoading = {
   html: '<div class="ajaxloading" id="ajaxloading"><div class="loding-box"><div class="icon-box"></div></div></div>',
   show() {
     const $loading = $('#ajaxloading')
     if ($loading.length > 0) {
       $dom.show()
     } else {
       $("body").append(this.html);
     }
   },
   hide() {
     $('#ajaxloading').hide()
   }
 }

 /**
  * 提示信息
  * @param {string} text 显示内容
  * @param {function} callBack 回调函数
  */
 export function tips(text, callBack) {
   function getHtml(text) {
     return '<div class="tips" id="tips"><div class="content"><div class="text">' + text + "</div></div></div>"
   }
   if ($("#tips").length > 0) {
     $("#tips").remove();
   }
   $("body").append(getHtml(text));
   $("#tips .content").addClass("fadeInUp animated");
   setTimeout(() => {
     $("#tips").remove();
     if (callBack) {
       setTimeout(() => {
         callBack()
       }, 500)
     }
   })
 }

 /**
  * 确认弹窗
  * @param {object} options 配置信息
  */
 export function modal(options) {
   function getHtml(title, content) {
     return '<div class="modal" id="modal"><div class="content"><div class="title">' + title + '</div><div class="text">' + content + '</div><div class="btn-box"><div class="left-btn">是</div><div class="right-btn">否</div></div></div></div>'
   }

   function hide() {
     $('#modal').hide()
   }
   const setting = Object.assign({
     title: '提示',
     content: '提示信息',
     success: undefined,
     fail: undefined
   }, options)
   if ($('#modal').length > 0) {
     $('#modal').remove()
   }
   $("body").append(getHtml(setting.title, setting.content))
   $('#modal').show()
   $("#warning .left-btn").on("click", function() {
     if (setting.confirm) {
       setting.confirm();
     }
     hide()
   })
   $("#warning .right-btn").on("click", function() {
     if (setting.fail) {
       setting.fail()
     }
     hide()
   })
 }

 /**
  * 确认弹窗
  * @param {object} el 要加入状态的dom元素
  * @param {number} state 列表状态：0(正常) 1(进行中) 2(暂无数据) 3(已无更多)
  */
 export function listStateChange(el, state) {
   function getHtml(text) {
     return '<div class="liststate-box" id="liststate"><div class="line"></div><div class="text-box"><div class="text">' + text + '</div></div></div>'
   }
   var $el = $(el)
   $el.find('#liststate').remove()
   switch (state) {
     case 1:
       $el.append('<div class="liststate-box" id="liststate"><div class="img"></div></div>')
       break
     case 2:
       $el.append(getHtml('暂无数据'))
       break
     case 3:
       $el.append(getHtml('已无更多'))
       break
   }
 }