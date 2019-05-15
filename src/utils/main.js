// 引入页面样式
import './../css/index.less' 
// 引入配置文件
import {environment} from './config'
// 引入页面组件
import {pageLoading} from './components'
// 手机调试插件
import vConsole from 'vconsole'
// 引入jquery插件
import {animateCss,isOnScreen} from './../utils/jqueryfn'
// 模板工具辅助方法
import {templateFn} from '../utils/templateFn'

// 初始化jquery插件
animateCss()
isOnScreen()
// 模板工具辅助方法注册
templateFn()

// 初始化调试模式
if(environment==='development'){
  new vConsole()
}
