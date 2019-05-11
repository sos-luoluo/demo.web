// UI组件
import {pageLoading, ajaxLoading, tips, modal, listStateChange} from '../utils/components'
// 静态数据
import {regular} from '../utils/constants'
// ajax方法
import {ajax} from '../utils/ajax'
// 字符串模板工具
import juicer from 'juicer'
// 模板工具辅助方法注册
import {templateFn} from '../utils/templateFn'
// 模板工具辅助方法注册
templateFn()

$(document).ready(()=>{
  const $dom={
    input: $("#phone"),
    submit: $("#btn")
  }
  $dom.submit.on("click",function(){
    const phone=$dom.input.val()
    if(regular.phone.test(phone)){
      ajax({
        urlAuto: false,
        type: 'get',
        url: 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm',
        dataType: 'jsonp',
        data:{
          tel: 15267146600
        }
      }).then((res)=>{
        console.log('成功',res)
      }).catch((err)=>{
        err.time=new Date().getTime()
        $("#result").html(juicer($("#resultTemp").html(), err))
      })
    }else{
      tips('手机号码不正确')
    }
  })
  pageLoading.hide()
})