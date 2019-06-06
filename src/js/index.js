// 引入公共文件
import '../utils/main'
// UI组件
import { pageLoading, tips, modal, ajaxLoading } from '../utils/components'
// 静态数据
import { regular } from '../utils/constants'
// ajax方法
import { ajax, ListAjax } from '../utils/ajax'
// 字符串模板工具
import juicer from 'juicer'


$(document).ready(() => {
  pageLoading.show()
  bindData().then(bindEvent).then(() => {
    pageLoading.hide()
  })
})

/**
 * 绑定数据
 */
function bindData() {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

/**
 * 绑定事件
 */
function bindEvent(data) {
  return new Promise((resolve, reject) => {
    const test={}
    test.constructor.getPrototypeOf=function(target,name){
      console.log(name)
      return target[name]
    }
    console.log(test)
    console.log(test.a)
    resolve()
  })
}