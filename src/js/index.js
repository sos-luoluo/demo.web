// 引入公共文件
import '../utils/main'
// UI组件
import {pageLoading, tips, modal,listStateChange} from '../utils/components'
// 静态数据
import {regular} from '../utils/constants'
// ajax方法
import {ajax,ListAjax} from '../utils/ajax'
// 字符串模板工具
import juicer from 'juicer'


$(document).ready(()=>{
  const $dom={
    input: $("#phone"),
    submit: $("#btn")
  }
  listStateChange("#listbox",1)
  // pageLoading.hide()
})