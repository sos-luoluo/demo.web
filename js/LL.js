/***********************
======▶JS核心文件◀======
========★落落★========
***********************/

var LL = {
  //====★版本号★====//
  //文件的版本号，用来区别不同版本文件，修改文件时，修改此版本号
  version: "2.0",

  //====★常用组件★====//
  //常用组件，请配合css使用
  components: {
    html: {
      pageLoading:
        '<div class="pageloading" id="pageloading"><div class="loding-box"><div class="icon-box"></div></div></div>',
      ajaxLoading:
        '<div class="ajaxloading" id="ajaxloading"><div class="loding-box"><div class="icon-box"></div></div></div>',
      warning: function(title, content) {
        return (
          '<div class="warning" id="warning"><div class="content"><div class="title">' +
          title +
          '</div><div class="text">' +
          content +
          '</div><div class="btn-box"><div class="left-btn">是</div><div class="right-btn">否</div></div></div></div>'
        );
      },
      tips: function(content) {
        return (
          '<div class="tips" id="tips"><div class="content"><div class="text">' +
          content +
          "</div></div></div>"
        );
      },
      listState:function(text){
        return '<div class="liststate-box" id="liststate"><div class="line"></div><div class="text-box"><div class="text">'+text+'</div></div></div>'
      }
    },
    pageLoading: {
      show: function() {
        var $dom = $("#pageloading");
        if ($dom.length > 0) {
          $dom.show();
        } else {
          $("body").append(LL.components.html.pageLoading);
        }
      },
      hide: function() {
        $("#pageloading").hide();
      }
    },
    ajaxLoading: {
      show: function() {
        var $dom = $("#ajaxloading");
        if ($dom.length > 0) {
          $dom.show();
        } else {
          $("body").append(LL.components.html.ajaxLoading);
        }
      },
      hide: function() {
        $("#ajaxloading").hide();
      }
    },
    modal: function(options) {
      var setting = $.extend(
        {
          title: "提示",
          content: "",
          confirm: undefined,
          cancel: undefined
        },
        options
      );
      function show(title, content) {
        if ($("#warning").length > 0) {
          $("#warning").remove();
        }
        $("body").append(LL.components.html.warning(title, content));
        $("#warning").show();
      }
      function hide() {
        $("#warning").remove();
      }
      function bindEvent() {
        $("#warning .left-btn").on("click", function() {
          if (setting.confirm) {
            setting.confirm();
          }
          hide();
        });
        $("#warning .right-btn").on("click", function() {
          if (setting.cancel) {
            setting.cancel();
          }
          hide();
        });
      }
      show(setting.title, setting.content);
      bindEvent();
    },
    showTips: function(content, callBack) {
      function show(content) {
        if ($("#tips").length > 0) {
          $("#tips").remove();
        }
        $("body").append(LL.components.html.tips(content));
        $("#tips .content").addClass("fadeInUp animated");
      }
      function hide() {
        $("#tips .content").removeClass("fadeInUp").addClass("fadeOutDown");
        setTimeout(function(){
          $("#tips").remove();
        },500)
      }
      show(content);
      setTimeout(function() {
        hide();
        if (callBack) {
          setTimeout(function() {
            callBack();
          }, 500);
        }
      }, 1800);
    },
    changeListState:function(state,el){
      $(el+" #liststate").remove()
      switch (state){
        case 1:
          $(el).append('<div class="liststate-box" id="liststate"><div class="img"></div></div>')
          break
        case 2:
          $(el).append(LL.components.html.listState('暂无数据'))
          break
        case 2:
          $(el).append(LL.components.html.listState('已无更多'))
          break
        default:
        break
      }
    }
  },

  //====★合并对象★====//
  /**
   * 合并多个对象，以空对象为基础进行合并,类型以第一个有效对象类型为准
   * @param {object} mode 是否深度合并
   * @param {object} obj 待合并对象数组
   */
  extend: function() {
    var result = {};
    for (var j = 0; j < arguments.length; j++) {
      if (LL.isArray(arguments[j])) {
        result = [];
        break;
      } else if (typeof arguments[j] === "object") {
        result = {};
        break;
      }
    }
    if (typeof arguments[0] === "boolean" && arguments[0] === true) {
      //执行深度合并
      for (var k = 0; k < arguments.length; k++) {
        if (k === 0) {
          continue;
        }
        for (var key in arguments[k]) {
          if (typeof arguments[k][key] === "object") {
            result[key] = LL.extend(true, result[key], arguments[k][key]);
          } else if (arguments[k][key]) {
            result[key] = arguments[k][key];
          }
        }
      }
    } else {
      //执行浅合并
      for (var i = 0; i <= arguments.length; i++) {
        for (var key in arguments[i]) {
          if (arguments[i][key]) {
            result[key] = arguments[i][key];
          }
        }
      }
    }
    return result;
  },

  //====★判断是否为数组★====//
  /**
   * 判断一个对象是否为数组
   * @param {object} obj 对象
   */
  isArray: function(obj) {
    return (
      obj &&
      typeof obj === "object" &&
      typeof obj.length === "number" &&
      typeof obj.splice === "function" &&
      !obj.propertyIsEnumerable("length")
    );
  },

  //====★延迟对象★====//
  //延迟对象
  deferred: function() {
    var setting = {
      state: 0, //延迟对象状态，0初始化，1失败了，2成功了
      param:[],
      done: [],
      fail: [],
      then: []
    };
    this.resolve = function() {
      if (setting.state === 0) {
        setting.state = 2;
        setting.param = arguments
        check()
      }
    };
    this.reject = function() {
      if (setting.state === 0) {
        setting.state = 1;
        setting.param = arguments
        check()
      }
    };
    this.done = function(method) {
      setting.done.push(method);
      check();
      return this;
    };
    this.fail = function(method) {
      setting.fail.push(method);
      check();
      return this;
    };
    this.then = function(method) {
      setting.then.push(method);
      return this;
    };
    function check() {
      if (setting.state === 2) {
        doList("done", arguments);
        doList("then", arguments);
      } else if (setting.state === 1) {
        doList("fail", arguments);
        doList("then", arguments);
      }
    }
    function doList(name) {
      while (setting[name].length > 0) {
        var item = setting[name].shift();
        item.apply(this,setting.param);
      }
    }
  },
  /**
   * 将多个延迟对象封装成一个
   * @param {object} promise 延迟对象
   */
  deferredAll: function() {
    var newDeferred = new LL.deferred();
    var setting = {
      result: [],
      state: true,
      length: arguments.length,
      done: function() {},
      fail: function() {},
      then: function() {}
    };
    for (var item of arguments) {
      item.done(function(res) {
        setting.result.push(res);
        checked();
      });
      item.fail(function(res) {
        setting.result.push(res);
        setting.state = false;
        checked();
      });
    }
    function checked() {
      if (setting.result.length === setting.length) {
        if (setting.state) {
          newDeferred.resolve.apply(this, setting.result);
        } else {
          newDeferred.reject.apply(this.setting.result);
        }
      }
    }
    return newDeferred;
  },

  //====★序列化数据★====//
  /**
   * 序列化数据用于Ajax,小程序不支持FormData,非小程序平台请使用FormData
   * @param {Array|object} data 原始数据
   * @returns {string}
   */
  serialize: function(data) {
    var formdata = new FormData();
    function conversion(data, name) {
      var isFirst = name === "" || name === undefined || name === null;
      for (var item in data) {
        if (typeof data[item] === "object") {
          conversion(data[item], isFirst ? item : name + "[" + item + "]");
        } else {
          formdata.append(isFirst ? item : name + "[" + item + "]", data[item]);
        }
      }
    }
    if (typeof data === "object") {
      conversion(data, "");
    } else {
      throw new Error("传入数据不是一个对象");
    }
    return formdata;
  },
  //====★将列表转化为树状结构★====//
  /**
   * 将列表数据转化为树状结构数据
   * @param {Array} treeList 原始数据
   * @param {object} treeConfig 配置
   */
  convertTree: function(treeList, treeConfig) {
    var setting = LL.extend(
      {
        rootID: 0, //根节点的值
        Fkey: "fcode", //子节点指向父节点的key
        Fid: "id", //父节点的key
        Skey: "children" //生成子节点名字
      },
      treeConfig
    );
    function querySon(condition) {
      var temp = [];
      for (var i = 0; i < treeList.length; i++) {
        if (treeList[i][setting.Fkey] === condition) {
          temp.push(treeList.splice(i, 1)[0]);
          i--;
        }
      }
      if (temp.length > 0) {
        for (var j = 0; j < temp.length; j++) {
          var result = querySon(temp[j][setting.Fid]);
          if (result.length > 0) {
            temp[j][setting.Skey] = result;
          }
        }
      }
      return temp;
    }
    return querySon(setting.rootID);
  },
  /**
   * 随机数算法
   * @param {number} value 种子
   */
  random: function(value) {
    var seed = value || new Date().getTime();
    return ((seed * 9301 + 49297) % 233280) / 233280;
  },
  /**
   * 生成guid
   */
  guid: function() {
    function getChat(){
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    }
    return (getChat()+getChat()+"-"+getChat()+"-"+getChat()+"-"+getChat()+"-"+getChat()+getChat()+getChat())
  },
  //====★通用ajax方法★====//
  /**
   * 通用请求方法
   * @param {object} options 配置
   */
  ajax: function(options) {
    var token=LL.localStorage.get('token')
    var setting = $.extend(
      {
        //id: LL.Tools.randomChars(5), //ajax的id
        hasLoading: false, //是否有loading
        confirmTitle: undefined, //是否有确认框
        urlAuto: true,
        url: "",
        headers:token?{token:token}:{},
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        async: true,
        data: {},
        dataType: undefined,
        context: undefined, //this
        processData: true, //序列化数据,formdata的时候需要false
        beforeSend: function() {}, //请求前回调
        success: function() {}, //请求成功回调
        fail: function() {}, //请求失败回调
        error: function() {}, //请求错误回调
        complete: function() {} //请求后回调
      },
      options
    );
    //锁定ajax状态，防止重复请求
    if (
      setting.id&&
      window.LL &&
      window.LL.ajaxData &&
      window.LL.ajaxData.lock &&
      window.LL.ajaxData.lock[setting.id]
    ) {
      return;
    } else {
      if (!window.LL) {
        window.LL = {};
      }
      if (!window.LL.ajaxData) {
        window.LL.ajaxData = {};
      }
      if (!window.LL.ajaxData.lock) {
        window.LL.ajaxData.lock = {};
      }
      window.LL.ajaxData.lock[setting.id] = true;
    }
    //问询用户是否同意发送请求
    if (setting.confirmTitle) {
      LL.components.modal({
        title: "确认",
        content: setting.confirmTitle,
        confirm: function() {
          request();
        }
      });
    } else {
      request();
    }
    //定义发送方法
    function request() {
      //显示Loading
      if (setting.hasLoading) {
        LL.components.ajaxLoading.show();
      }
      $.ajax({
        url: setting.urlAuto
          ? Config.AjaxSetting.URLHead + setting.url
          : setting.url,
        type: setting.type,
        headers:setting.headers,
        contentType: setting.contentType,
        data: setting.data,
        dataType: setting.dataType,
        context: setting.context,
        processData: setting.processData,
        beforeSend: setting.beforeSend,
        complete: function(XHR, TS) {
          delete window.LL.ajaxData.lock[setting.id];
          if (setting.hasLoading) {
            LL.components.ajaxLoading.hide();
          }
          if (XHR.status === 200) {
            if (XHR.responseJSON && XHR.responseJSON.code === 0) {
              setting.success(XHR.responseJSON);
            } else {
              setting.fail(XHR.responseJSON);
            }
          } else {
            LL.components.showTips("网络错误，请稍后再试");
            setting.fail();
          }
          setting.complete(XHR.responseJSON)
        }
      });
    }
  },

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
   * 表单方法
   * 表单定义 form-name form-rule form-key
   */
  form: {
    // 获取表单数据
    getFormData: function(form) {
      var formData = LL.form.getFormItemList(form)
      for(var key in formData){
        switch (formData[key].nodeName){
          case "INPUT":
          case "TEXTAREA":
          formData[key].value=formData[key].dom.val()
          break;
          case "IMG":
          formData[key].value=formData[key].dom.attr("src")
          break
          default:
          formData[key].value=formData[key].dom.text()
          break
        }
      }
      return formData;
    },
    // 获取dom列表
    getFormItemList: function(form) {
      var $formItemList = $(form).find("[form-key]");
      var formData = {};
      $formItemList.each(function(i, item) {
        var $item = $(item);
        var rule = $item.attr("form-rule") || "";
        formData[$item.attr("form-key")] = {
          rule: rule ? rule.split(",") : [],
          nodeName: $item[0].nodeName,
          name:$item.attr("form-name") || "",
          dom: $item
        };
      });
      return formData;
    },
    // 验证数据合法性
    verification:function(options){
      var setting=$.extend({
        formData:{},
        success:function(){},
        fail:function(){}
      },options)
      for(var key in setting.formData){
        var rule=setting.formData[key].rule
        for(var i=0;i<rule.length;i++){
          if(rule[i]==="require"){
            if(!setting.formData[key].value){
              setting.fail(setting.formData[key],rule[i])
              return
            }
          }else{
            if(!Config.regular[rule[i]].test(setting.formData[key].value)){
              setting.fail(setting.formData[key],rule[i])
              return
            }
          }
        }
      }
      setting.success()
    },
    // 获取数据
    getData:function(options){
      var setting=$.extend({
        el:"",
        error:function(item,reason){
          if(reason==="require"){
            LL.components.showTips("请输入"+item.name)
          }else{
            LL.components.showTips(item.name+"格式不正确")
          }
        },
        success:function(){},
        fail:function(){}
      },options)
      var formData=LL.form.getFormData(setting.el)
      LL.form.verification({
        formData: formData,
        success:function(){
          var newFormData={}
          for(var key in formData){
            newFormData[key]=formData[key].value
          }
          setting.success(newFormData)
        },
        fail:function(item,reason){
          setting.error(item,reason)
          setting.fail(formData)
        }
      })
    },
    // 设置数据
    setData:function(options){
      var setting=$.extend({
        el: "",
        formData:{}
      },options)
      var formDomList=LL.form.getFormItemList(setting.el)
      for(var key in setting.formData){
        if(formDomList[key]){
          switch (formDomList[key].nodeName){
            case "INPUT":
            case "TEXTAREA":
            formDomList[key].dom.val(setting.formData[key])
            break
            case "IMG":
            formDomList[key].dom.attr("src",setting.formData[key])
            break
            default:
            formDomList[key].dom.text(setting.formData[key])
            break
          }
        }
      }
    }
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
   * 工具箱
   */
  Tools: {
    /**
     * 时间戳转化为指定格式，例yyyy-mm-dd hh:nn:ss ww
     * @param {number} timestamp 时间戳
     * @param {string} format 输出格式
     */
    timeFormat: function(timestamp, format) {
      if (isNaN(timestamp)) {
        return timestamp;
      }
      if (timestamp < 4100000000) {
        timestamp = timestamp * 1000;
      }
      var time = new Date(timestamp);
      var weekLib = Config.wordLib.week;
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var n = time.getMinutes();
      var s = time.getSeconds();
      format = format.replace(/[y]{4}/i, y);
      format = format.replace(/[m]{2}/i, m > 9 ? m : "0" + m);
      format = format.replace(/[d]{2}/i, d > 9 ? d : "0" + d);
      format = format.replace(/[h]{2}/i, h > 9 ? h : "0" + h);
      format = format.replace(/[n]{2}/i, n > 9 ? n : "0" + n);
      format = format.replace(/[s]{2}/i, s > 9 ? s : "0" + s);
      format = format.replace(/[w]{2}/i, weekLib[time.getDay()]);
      return format;
    },
    /**
     * 日期转化为指定格式
     * @param {string} date 日期
     * @param {string} format 输出格式
     */
    dateFormat: function(date, format) {
      var time;
      try {
        time = new Date(date);
      } catch (e) {
        return date;
      }
      return LL.Tools.timeFormat(time.getTime(), format);
    },
    /**
     * 价格数据处理，可以取整，取两位小数，或者只取小数
     * @param {number} price 价格
     * @param {string} format 输出格式
     */
    priceFormat: function(price, format) {
      if (isNaN(price)) {
        return price;
      }
      if (format === "int") {
        return Math.floor(price);
      } else if (format === "float") {
        return price.toFixed(2).split(".")[1];
      } else {
        return price.toFixed(2);
      }
    },
    /**
     * 返回两位数，返回格式可能为数字或字符
     * @param {string} num 输入数字
     *
     */
    doubleDigit: function(num) {
      num = parseInt(num);
      return num > 9 ? num : "0" + num;
    },
    /**
     * 只取一个图片地址
     * @param {number} urlString 输入地址
     */
    onlyOneImg: function(urlString) {
      return urlString.split(",")[0];
    },
    /**
     * 返回随机字符串
     * @param {number} length 长度
     */
    randomChars: function(length) {
      var str = "";
      var maxRandom = Config.wordLib.charAndNum.length;
      for (var i = 0; i < length; i++) {
        str += Config.wordLib.charAndNum[Math.floor(Math.random() * maxRandom)];
      }
      return str;
    },
    /**
     * 时间转化为指定天时分秒
     * @param {number} time 时间
     * @param {string} format 输出格式
     */
    timeIntervalChange: function(time, format) {
      if (isNaN(time)) {
        return time;
      }
      time = parseInt(time);
      format = format.replace(/[d]{2}/i, Math.floor(time / 86400));
      format = format.replace(
        /[h]{2}/i,
        LL.Tool.doubleDigit(Math.floor((time % 86400) / 3600))
      );
      format = format.replace(
        /[m]{2}/i,
        LL.Tool.doubleDigit(Math.floor((time % 3600) / 60))
      );
      format = format.replace(
        /[s]{2}/i,
        LL.Tool.doubleDigit(Math.floor(time % 60))
      );
      return format;
    },
    /**
     * 时间差转化，格式为几分钟之前，几个小时之前，具体时间
     * @param {number} time 时间
     */
    timeAgo: function(time) {
      //如果不是数字，则原样返回
      if (isNaN(time)) {
        return time;
      }
      var difference = new Date().getTime() - time;
      if (difference < 60 * 60 * 1000) {
        return Math.floor(difference / (1000 * 60)) + "分钟以前";
      } else if (difference < 24 * 60 * 60 * 1000) {
        return Math.floor(difference / (1000 * 60 * 60)) + "小时以前";
      } else {
        return LL.Tool.dateFormat(Math.floor(time / 1000), "yyyy-mm-dd");
      }
    },
    /**
     * 获取url参数
     * @param {string} url url地址
     * @param {string} name 参数名称
     */
    getUrlParam: function(url, name) {
      var reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)");
      var r = url.match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    /**
     * 转换数据进制
     * @param {number} num 输入十进制数字
     * @param {number} log 输出进制
     */
    changeLog(num, log) {
      var int = [];
      function getInt() {
        var now = num % log;
        int.unshift(now);
        num = Math.floor(num / log);
        if (num > 0) {
          getInt();
        }
      }
      getInt();
      int = int.map(function(item) {
        return Config.charAndNum[item];
      });
      return int.join("");
    },
    /**
     * 获取纯净的数据模型
     * @param {number} data 输入数据
     */
    getPureModel(data) {
      return JSON.parse(JSON.stringify(data));
    },
    /**
     * 判定是否在小程序环境
     * 异步方法！！！
     */
    isMiniProgram:function(callBack){
      return wx.miniProgram.getEnv(function(res){
        if(callBack){
          callBack(res.miniprogram)
        }
      })
    }
  },
  /**
   * cookie操作
   */
  cookie: {
    set: function(key, value, time) {
      if (time !== 0) {
        var expires = time * 1000;
        var date = new Date(new Date().getTime() + expires);
        document.cookie =
          key + "=" + escape(value) + ";expires=" + date.toUTCString();
      } else {
        document.cookie = key + "=" + escape(value);
      }
    },
    get: function(key) {
      var arr,
        reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    del: function(key) {
      var time = new Date(1000);
      var value = LL.Cookie.get(key);
      if (value != null) {
        document.cookie = key + "=" + value + ";expires=" + time.toGMTString();
      }
    }
  },
  /**
   * Storage操作
   */
  localStorage:{
    set:function(key,value){
      var storage = window.localStorage;
      storage && storage.removeItem(key);
      storage && storage.setItem(key, value);
    },
    get:function(key){
      var storage = window.localStorage;
      return storage && storage.getItem(key);
    },
    del:function(key){
      var storage = window.localStorage;
      storage && storage.removeItem(key);
    },
    clear:function(){
      var storage = window.localStorage;
      storage.clear()
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
   * jquery插件
   */
  jqueryFn:{
    //动画插件
    animateCss:function(){
      $.fn.extend({
        animateCss: function(animationName, callback) {
          var animationEnd = (function(el) {
            var animations = {
              animation: 'animationend',
              OAnimation: 'oAnimationEnd',
              MozAnimation: 'mozAnimationEnd',
              WebkitAnimation: 'webkitAnimationEnd',
            };
      
            for (var t in animations) {
              if (el.style[t] !== undefined) {
                return animations[t];
              }
            }
          })(document.createElement('div'));
      
          this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
      
            if (typeof callback === 'function') callback();
          });
          return this;
        },
      });
    },
    //判定元素是否进入视口
    isOnScreen:function(){
      $.fn.isOnScreen = function(){
        var win = $(window);
        var viewport = {
            top : win.scrollTop(),
            left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();
        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
      };
    }
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
