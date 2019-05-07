 import tools from './tools'
 import artTemplate from 'art-template'
 
 /**
  * template方法注册
  * @overview template方法注册，用于绑定数据
  * @author [luoluo]
  * @version 2.0.0
  */

  export function templateFn(){
    artTemplate.defaults.imports.dateFormat=tools.timeFormat
    artTemplate.defaults.imports.priceformat=tools.priceFormat
  }