 import tools from './tools'
//  import artTemplate from 'art-template'
import juicer from 'juicer'
 /**
  * template方法注册
  * @overview template方法注册，用于绑定数据,art-template不兼容最新的nodejs，考虑用juicer,文档地址https://github.com/PaulGuo/Juicer
  * @author [luoluo]
  * @version 2.0.0
  */

  // export function templateFn(){
  //   artTemplate.defaults.imports.dateFormat=tools.timeFormat
  //   artTemplate.defaults.imports.priceformat=tools.priceFormat
  // }

  export function templateFn(){
    // 防止冲突，自定义边界
    juicer.set({
      'tag::operationOpen': '{{',
      'tag::operationClose': '}}',
      'tag::interpolateOpen': '{{',
      'tag::interpolateClose': '}}',
      'tag::noneencodeOpen': '{{#',
      'tag::noneencodeClose': '}}',
      'tag::commentOpen': '{{!',
      'tag::commentClose': '}}'
    });
    juicer.register('timeFormat',tools.timeFormat)
    juicer.register('priceformat',tools.priceformat)
  }
