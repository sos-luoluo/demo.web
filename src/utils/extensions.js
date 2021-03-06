/**
 * 原生方法扩展
 * @overview 扩展JS原生方法，方便使用
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 数组求和
 * @param {function|string|undefined} propertyOrFunc
 */
Array.prototype.sum = function (propertyOrFunc) {
  var total = 0
  for (let i = 0; i < this.length; i++) {
    total += typeof (propertyOrFunc) === "function" ? propertyOrFunc(this[i]) : typeof (propertyOrFunc) === "string" ? this[i][propertyOrFunc] : this[i]
  }
  return total
}

/**
 * 获取map的长度
 */
Map.prototype.getLength = function () {
  var count = 0;
  this.forEach(() => {
    count++
  })
  return count;
}

export default undefined