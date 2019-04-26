 /**
  * 项目常用组件
  * @overview 常用组件
  * @author [luoluo]
  * @version 2.0.0
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