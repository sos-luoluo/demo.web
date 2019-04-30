/***********************
======▶JS核心文件◀======
========★落落★========
***********************/

var LL = {
  //====★版本号★====//
  //文件的版本号，用来区别不同版本文件，修改文件时，修改此版本号
  version: "2.0",


  /**
   * 列表请求方法
   * @param {object} options 配置
   */
  listAjax:function(options){
    var setting=$.extend({
      el: "#listwrap", //绑定元素jq选择器
      scrollBox:'body',//滚动父元素
      hasLoading: false,
      url: "",
      urlAuto: true, //是否自动处理地址，可单独处理特殊请求地址
      data: {}, //请求数据
      dataType: "json", //数据格式
      type: "POST", //请求方式
      // result: function(res) {
      //   return res
      // }, //添加返回数据处理方法，同步方法
      //once: function(){},//仅处理一次
      success: function() {}, //请求成功回调 
      fail: function() {}, //请求失败回调
      complete: function() {}, //请求完成后回调
      listState: 0, //列表请求状态码，0正常，1进行中，2暂无数据，3已无更多
      pageIndex: 0, //列表请求页面序号初始值 
      pageSize: 10, //列表请求页面数组大小
      pageTotal: 0 //列表总大小
    },options)
    function send(pageIndex){
      if (setting.listState === 1 || setting.listState === 2 || setting.listState === 3) {
        return
      }
      setting.listState=1
      LL.components.changeListState(setting.listState,setting.el)
      if(pageIndex&&pageIndex<=pageTotal){
        setting.pageIndex=pageIndex
      }else{
        setting.pageIndex++
      }
      LL.ajax({
        id: setting.el,
        hasLoading: setting.hasLoading,
        urlAuto: setting.urlAuto,
        url: setting.url,
        type: setting.type,
        data: $.extend({
          current:setting.pageIndex,
          size:setting.pageSize
        },setting.data),
        dataType: setting.dataType,
        success: function(res) {
          setting.pageTotal = res.data.pages
          LL.components.changeListState(0,setting.el)
          if (setting.pageTotal === 0) {
            setting.listState = 2
          }else if (setting.pageTotal === setting.pageIndex) {
            setting.listState = 3
          } else {
            setting.listState = 0
          }
          if(res.data.records.length>0){
            var result=""
            if (setting.result){
              result = setting.result(res.data.records)
            }
            if(setting.pageIndex === 1){
              $(setting.el).html(result)
            }else{
              $(setting.el).append(result)
            }
          }
          LL.components.changeListState(setting.listState,setting.el)
        },
        fail: function(res) {
          setting.listState = 0
          LL.components.changeListState(setting.listState,setting.el)
          setting.fail(res)
        },
        complete: function(res) {
          if (setting.once) {
            setting.once(res)
            delete setting.once
          }
          setting.complete(res)
        }
      })
    }
    //绑定事件
    function bindEvent(){
      if(!$.fn.isOnScreen){
        LL.jqueryFn.isOnScreen()
      }
      $(setting.scrollBox).scroll(function(e){
        if($(setting.el).find(":last").isOnScreen()){
          send()
        } 
      })
    }
    bindEvent()
    //发送方法
    this.send=send
    //增加参数
    this.addData=function(data){
      setting.data=$.extend(true,setting.data,data)
    }
    //改变参数
    this.changeData=function(data){
      setting.data=$.extend(true,setting.data,data)
    }
    //删除参数
    this.delData = function(name) {
      delete setting.data[name]
    }
    //更改请求地址
    this.changeURL = function(url) {
      setting.url = url
    }
    //刷新数据
    this.refreshPage=function(){
      setting.listState = 0
      setting.pageIndex = 0
      send()
    }
  },
  /**
   * 验证码计时器
   * @param {object} options 配置
   */
  verificationCodeTime: function(options) {
    var setting = $.extend(
      {
        el: "",
        time: 60,
        text: "获取验证码"
      },
      options
    );
    setting.$dom = $(setting.el);
    setting.$dom.css({ "pointer-events": "none" });
    var stopKey = setInterval(function() {
      setting.$dom.text(setting.time + "S");
      if (setting.time < 0) {
        clearInterval(stopKey);
        setting.$dom.text(setting.text);
        setting.$dom.css({ "pointer-events": "all" });
      }
      setting.time--;
    }, 1000);
  },

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
  },
  /**
   * 地址跳转
   * @param {object} options 配置
   */
  urlJump: function(url, isReplace) {
    url = url || "/"; //url不存在跳转首页
    if (isReplace === true) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  },

  /**
   * template注册
   */
  template: function() {
    if (!template || typeof template != "function") {
      return;
    }
    template.helper("dateformat", LL.Tools.dateFormat);
    template.helper("priceformat", LL.Tools.priceFormat);
  },

  /**
   * AES加密解密算法
   */
  AES:{
    //加密
    encrypt:function(word,key){
      return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(word), CryptoJS.enc.Utf8.parse(key), {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7}).toString()
    },
    //解密
    decrypt:function(word,key){
      return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(word, CryptoJS.enc.Utf8.parse(key), {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7})).toString()
    }
  },
  /**
   * Base64处理方法
   */
  Base64 : {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function(input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = LL.Base64._utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + LL.Base64._keyStr.charAt(enc1) + LL.Base64._keyStr.charAt(enc2) + LL.Base64._keyStr.charAt(enc3) + LL.Base64._keyStr.charAt(enc4);
      }
      return output;
    },
    // public method for decoding
    decode: function(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = LL.Base64._keyStr.indexOf(input.charAt(i++));
        enc2 = LL.Base64._keyStr.indexOf(input.charAt(i++));
        enc3 = LL.Base64._keyStr.indexOf(input.charAt(i++));
        enc4 = LL.Base64._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = LL.Base64._utf8_decode(output);
      return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  },
  /**
   * 文件流处理方法
   * 获取文件流，在回调函数中会带上Blob参数,注意未指定文件类型，需要自行处理文件类型
   */
  Filestream:function(url,callBack){
    var XHR = new XMLHttpRequest();
    XHR.open("GET", url,true);
    XHR.responseType = "blob";
    XHR.onload = function(oEvent) {
      var content = XHR.response;
      if(callBack){
        callBack(new Blob([content]))
      }
    };
    XHR.send();
  }
};
