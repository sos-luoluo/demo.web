// 引入页面样式
import './../css/index.less' 
import {pageLoading} from './components'
// 文档加载完毕再处理逻辑
$(document).ready(function () {
  pageLoading.show()
});
