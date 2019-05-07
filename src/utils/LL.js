/***********************
======▶JS核心文件◀======
========★落落★========
***********************/

var LL = {
  //====★版本号★====//
  //文件的版本号，用来区别不同版本文件，修改文件时，修改此版本号
  version: "2.0",
  /**
   * H5页面相关方法
   */
  mobileWeb:{
    //初始化方法，会初始化rem，初始化页面比例
    init:function(){
      var width = $(window).width()
      var height = $(window).height()
      if(Config.mobileWeb.mode==="cover"){
        var scale = Config.mobileWeb.scale
        if(width/height>scale){
          width=height*scale
        }else{
          height=width/scale
        }
      }      
      var htmlFontSize = (width / 375) * 50;
      $("html").css({
        fontSize: htmlFontSize
      });
      $('.m-content').css({
        width: width+'px',
        height: height+'px'
      })
      //动画插件
      LL.jqueryFn.animateCss()
      //实例化页面栈控制
      if($('#pageswiper').length>0){
        window.page=new Swiper('#pageswiper',{
          initialSlide: 0,
          direction: 'vertical',
          width:width,
          height:height,
          loop:true,
          // threshold: 100,
          // effect: 'cube'
        })
      }
    },
    //页面栈进出控制方法
    pageCtrl:function(options){
      var setting=$.extend({
        index:0
      },options)
      setting.pageList=$('.m-page .m-content .page')
      setting.pageList.eq(setting.index).css({
        display: 'block'
      })
      function pageAnimate($dom,type){
        if(type==="out"){
          $dom.animateCss('fadeOutUp',function(){
            $dom.removeClass('fadeOutUp').hide()
          })
        }else if(type==="in"){
          $dom.show().animateCss('fadeInUp',function(){
            $dom.removeClass('fadeInUp')
          })
        }
      }
      function next(){
        pageAnimate(setting.pageList.eq(setting.index),"out")
        if(setting.index===setting.pageList.length-1){
          setting.index=0
        }else{
          setting.index++
        }
        pageAnimate(setting.pageList.eq(setting.index),"in")
      }
      this.next=next
      function prev(){
        pageAnimate(setting.pageList.eq(setting.index),"out")
        if(setting.index===0){
          setting.index=setting.pageList.length-1
        }else{
          setting.index--
        }
        pageAnimate(setting.pageList.eq(setting.index),"in")
      }
      this.prev=prev
      function navigatorTo(index){
        pageAnimate(setting.pageList.eq(setting.index),"out")
        setting.index=index
        pageAnimate(setting.pageList.eq(setting.index),"in")
      }
      this.navigatorTo=navigatorTo
    },
    setPageSize(){
      function setSize(){
        var windowHeight=$(window).height();
        var windowWidth=$(window).width();
        var styleString="";
        styleString+=".windowheight{height:"+windowHeight+"px};";
        styleString+=".windowwidth{height:"+windowWidth+"px}";
        var dom=$("#styleSheet")
        if(dom.length>0){
          dom.text(styleString)          
        }else{
          var style=document.createElement('style')
          style.setAttribute('type', 'text/css');
          style.setAttribute('id', 'styleSheet');
          style.innerHTML = styleString;
          $("body").prepend(style)
        }
      }
      setSize()
      $(window).on("resize",function(){
        setSize()
      })
    }
  }
};
