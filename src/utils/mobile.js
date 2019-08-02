/**
 * 用于移动网页的相关方法
 * @overview 在移动网页上初始化rem、页面尺寸
 * @author [luoluo]
 * @version 2.0.0
 */

import { mobileConfig } from "./config";

/**
 * 页面栈进出控制方法
 * @overview 这是自己做的一个H5页面的页面切换控制方法，需要配合css使用
 * @constructor
 * @param {number} index 初始页面序号
 * @param {string} el jquer选择器
 */
export class pageCtrl {
  index = 0;
  pageList = [];
  constructor(options) {
    this.index = options.index;
    this.pageList = $(options.el);
    this.pageList.eq(this.index).css({ display: "block" });
  }
  pageAnimate($dom, type) {
    if (type === "out") {
      $dom.animateCss("fadeOutUp", function() {
        $dom.removeClass("fadeOutUp").hide();
      });
    } else if (type === "in") {
      $dom.show().animateCss("fadeInUp", function() {
        $dom.removeClass("fadeInUp");
      });
    }
  }
  /**
   * 跳转到下一页
   */
  next() {
    this.pageAnimate(this.pageList.eq(this.index), "out");
    if (this.index === this.pageList.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }
    this.pageAnimate(this.pageList.eq(this.index), "in");
  }
  /**
   * 跳转到上一页
   */
  prev() {
    this.pageAnimate(this.pageList.eq(this.index), "out");
    if (this.index === 0) {
      this.index = this.pageList.length - 1;
    } else {
      this.index--;
    }
    this.pageAnimate(this.pageList.eq(this.index), "in");
  }
  /**
   * 跳转到指定页
   * @param {number} index 页面序号
   */
  navigatorTo(index) {
    this.pageAnimate(this.pageList.eq(this.index), "out");
    this.index = index;
    this.pageAnimate(this.pageList.eq(this.index), "in");
  }
}

/**
 * 页面尺寸初始化方法
 * @overview 初始化页面基础字体大小及页面宽高
 */
export function setPageSize() {
  let width = $(window).width();
  let height = $(window).height();
  let styleString = "";
  styleString += ".windowheight{height:" + height + "px};";
  styleString += ".windowwidth{height:" + width + "px}";
  const dom = $("#styleSheet");
  if (dom.length > 0) {
    dom.text(styleString);
  } else {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", "styleSheet");
    style.innerHTML = styleString;
    $("body").prepend(style);
  }
  if (mobileConfig.mode === "cover") {
    const scale = mobileConfig.scale;
    if (width / height > scale) {
      width = height * scale;
    } else {
      height = width / scale;
    }
  }
  const htmlFontSize = (width / 375) * 50;
  $("html").css({
    fontSize: htmlFontSize
  });
  $(".m-content").css({
    width: width + "px",
    height: height + "px"
  });
}
