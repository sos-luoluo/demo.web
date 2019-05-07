// 引入页面样式
import './../css/index.less' 
// 引入配置文件
import {environment} from './config'
// 工具方法
import tools from './tools'
// 引入template方法
//import {templateFn} from './templateFn'
var artTemplate =require('art-template') 
// 引入jquery插件
import {animateCss,isOnScreen} from './jqueryfn'
// 引入页面组件
import {pageLoading} from './components'
// 手机调试插件
import vConsole from 'vconsole'
// 初始化template方法
// templateFn()
// 初始化jquery插件
animateCss()
isOnScreen()
// 初始化调试模式
if(environment==='development'){
  new vConsole()
}

// 文档加载完毕再处理逻辑
$(document).ready(function () {
  pageLoading.show()
});
