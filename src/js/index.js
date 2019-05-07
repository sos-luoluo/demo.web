import {pageLoading, ajaxLoading, tips, modal, listStateChange} from '../utils/components'

$(document).ready(()=>{
  $("#btn").on("click",function(){
    pageLoading.show()
  })
  pageLoading.hide()
})