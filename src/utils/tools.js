 import { wordLib } from './constants';

 /**
  * 工具箱
  * @overview 常用工具方法
  * @author [luoluo]
  * @version 2.0.0
  */

 export default {
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
     const time = new Date(timestamp);
     const week = wordLib.week;
     const y = time.getFullYear();
     const m = time.getMonth() + 1;
     const d = time.getDate();
     const h = time.getHours();
     const n = time.getMinutes();
     const s = time.getSeconds();
     format = format.replace(/[y]{4}/i, y);
     format = format.replace(/[m]{2}/i, m > 9 ? m : "0" + m);
     format = format.replace(/[d]{2}/i, d > 9 ? d : "0" + d);
     format = format.replace(/[h]{2}/i, h > 9 ? h : "0" + h);
     format = format.replace(/[n]{2}/i, n > 9 ? n : "0" + n);
     format = format.replace(/[s]{2}/i, s > 9 ? s : "0" + s);
     format = format.replace(/[w]{2}/i, week[time.getDay()]);
     return format;
   },
   /**
    * 日期转化为指定格式
    * @param {string} date 日期
    * @param {string} format 输出格式
    */
   dateFormat: function(date, format) {
     let time;
     try {
       time = new Date(date);
     } catch (e) {
       return date;
     }
     return this.timeFormat(time.getTime(), format);
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
     const str = ""
     const maxRandom = wordLib.charAndNum.length
     for (var i = 0; i < length; i++) {
       str += wordLib.charAndNum[Math.floor(Math.random() * maxRandom)];
     }
     return str
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
     format = format.replace(/[h]{2}/i, this.doubleDigit(Math.floor((time % 86400) / 3600)));
     format = format.replace(/[m]{2}/i, this.doubleDigit(Math.floor((time % 3600) / 60)));
     format = format.replace(/[s]{2}/i, this.doubleDigit(Math.floor(time % 60)));
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
     const difference = new Date().getTime() - time;
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
     const reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)");
     const r = url.match(reg);
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
     const int = []

     function getInt() {
       const now = num % log;
       int.unshift(now);
       num = Math.floor(num / log);
       if (num > 0) {
         getInt();
       }
     }
     getInt();
     int = int.map(function(item) {
       return wordLib.charAndNum[item];
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
    * 地址跳转
    * @param {string} url 跳转地址
    * @param {boolean} isReplace 是否保存本页历史记录
    */
   urlJump: function(url, isReplace) {
     url = url || "/"
     if (isReplace === true) {
       window.location.replace(url);
     } else {
       window.location.href = url;
     }
   },
 }