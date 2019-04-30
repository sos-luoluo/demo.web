// 引入页面样式
import './../css/index.less' 
// 引入jquery插件
import {isOnScreen} from './jqueryfn'
import {pageLoading} from './components'
isOnScreen()
// 文档加载完毕再处理逻辑
$(document).ready(function () {
  pageLoading.show()
});
