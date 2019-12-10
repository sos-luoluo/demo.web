 import tools from './tools'
import juicer from 'juicer'

 /**
  * template方法注册
  * @overview template方法注册，用于绑定数据,art-template不兼容最新的nodejs，考虑用juicer,文档地址https://github.com/PaulGuo/Juicer
  * @author [luoluo]
  * @version 2.0.0
  */
  export function templateFn(){
    // 防止冲突，自定义边界
    // juicer.set({
    //   'tag::operationOpen': '@{{', // 代码执行
    //   'tag::operationClose': '}}',
    //   'tag::interpolateOpen': '{{', // 数据绑定
    //   'tag::interpolateClose': '}}',
    //   'tag::noneencodeOpen': '#{{', // 避免转义绑定
    //   'tag::noneencodeClose': '}}',
    //   'tag::commentOpen': '!{{', // 注释
    //   'tag::commentClose': '}}'
    // });
    juicer.register('timeFormat',tools.timeFormat)
    juicer.register('priceformat',tools.priceformat)
  }
