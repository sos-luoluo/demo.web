/***********************
======▶JS核心配置文件◀===
========★落落★========
***********************/

!(function(){
  var numArr = '0123456789'.split('')
  var characterArr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  // 开发模式，Development:开发模式，Test:测试模式，Online:线上模式
  var mode = 'Test'
  // 线上地址 https://wxz.yykik.cn
  // 本地地址 http://10.26.20.43:8080
  var getURL = function(){
    return mode === 'Development' ? '/api/v1' : '/api/v1'
  }
  
  var Config = {
    //配置文件的版本号，用来区别不同版本配置文件，修改配置文件时，修改此版本号
    version: "2.0",
    //程序开发模式
    mode: mode,
    //项目中文名称
    chName: "",
    //项目英文文名称
    enName: "",
  
    //====★Ajax请求相关配置★====//
    AjaxSetting: {
      //Ajax请求地址头部
      URLHead: getURL(),
      //上传图片接口
      imgUploadPort: "/public/uploadFile",
      //上传文件接口
      filePort: "/controller.ashx?action=uploadimage",
      //Loading显示文字
      loadingTitle: "加载中",
    },
  
    //====★页面结构相关配置★====//
    pageSetting: {
      //主页页面路径
      home: "/pages/Home/Index",
      //登录页面路径
      login: "/pages/Home/Login",
    },

    //====★移动端网页配置★====//
    mobileWeb:{
      //网页宽高比
      scale: 750/1210,
      mode:'contain'
    },
  
    //虚拟用户
    NPCInfo: {
      openID: "oCkn-0LsCAirFyL9nQ80myluoluo",
      name: "落落",
      headPortrait: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI2iasISZ1LOFONyGqyKiaEkbIIvyLPyz9cz1hocv2rcBwgGuqib2Y5BmD3YDSLcsUjc8PQXb9YdsKhg/0"
    },
  
    //====★字典库★====//
    wordLib: {
      //数字字典库
      int: numArr,
      //字母字典库
      char: characterArr,
      //字母数字字典库
      charAndNum: numArr.concat(characterArr),
      //星期字典库，可以用来处理星期显示格式
      week: "日一二三四五六".split(''),
      numCn:'零一二三四五六七八九十'.split('')
    },
  
    //====★正则表达式★====//
    regular: {
      //电话号码
      phone: /^1[3|4|5|7|8|9][0-9]{9}$/,
      //中文字符1-10个
      chinese: /^[\u4e00-\u9fa5]{1,10}$/,
      //邮箱地址
      email: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      //网址
      url: /[a-zA-z]+:\/\/[^\s]*/,
      //身份证号
      id: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
      //普通密码6-20位
      password: /^[a-zA-Z0-9_~！@#￥%…&—=【】、《》<>:;"'\-\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/]{6,20}$/,
      //纯数字
      num: /^\d{1,}$/,
      floatNum:/^(([1-9]\d*)|0)(\.\d{1-2})?$/,
      //纯字母
      character: /^[a-zA-Z]{1,}$/,
      //车牌号
      carNum: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
    },
  
    //====★密匙相关★====//
    key: {
    }
  
  }
  window.Config = Config
})()

