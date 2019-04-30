/**
 * jquery扩展方法或插件
 * @overview jquery扩展方法或插件
 * @author [luoluo]
 * @version 2.0.0
 */

 /**
 * 动画插件
 * @param {string} animationName 动画名称
 * @param {function} callback 回调函数
 */
export function animateCss(){
  $.fn.animateCss= function(animationName, callback) {
    const animationEnd = (function(el) {
      const animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };
  
      for (let t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'))
  
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName)
  
      if (typeof callback === 'function') callback()
    })
    return this
  }
}

 /**
 * 判定元素是否位于视口内
 */
export function isOnScreen(){
  $.fn.isOnScreen = function(){
    const win = $(window);
    const viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    const bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom))
  }
}
