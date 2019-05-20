import { regular } from './constants'
import { tips } from './components'

/**
 * 表单处理方法
 * @overview 通用表单处理方法
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 获取表单信息
 * @overview 包含表单类型、key、名字、验证规则
 * @param {string} form jquery选择器
 * @return {object}
 */
function getFormItemList(form) {
  var $formItemList = $(form).find("[form-key]")
  var formData = {}
  $formItemList.each(function(i, item) {
    const $item = $(item);
    const rule = $item.attr("form-rule") || "";
    formData[$item.attr("form-key")] = {
      rule: rule ? rule.split(",") : [],
      nodeName: $item[0].nodeName,
      name: $item.attr("form-name") || "",
      dom: $item
    }
  })
  return formData
}


/**
 * 根据表单类型获取表单数据
 * @param {string} form jquery选择器
 * @return {object}
 */
function getFormData(form) {
  const formData = getFormItemList(form)
  for (let key in formData) {
    switch (formData[key].nodeName) {
      case "INPUT":
      case "TEXTAREA":
        formData[key].value = formData[key].dom.val()
        break;
      case "IMG":
        formData[key].value = formData[key].dom.attr("src")
        break
      default:
        formData[key].value = formData[key].dom.text()
        break
    }
  }
  return formData;
}

/**
 * 验证数据合法性
 * @param {object} options 配置信息
 * @param {object} formData 获取到的表单数据
 * @param {function} success 成功回调
 * @param {function} fail 失败回调
 * @return {object}
 */
function verification(options) {
  const setting = $.extend({
    formData: {},
    success: function() {},
    fail: function() {}
  }, options)
  for (let key in setting.formData) {
    let rule = setting.formData[key].rule
    for (let i = 0; i < rule.length; i++) {
      if (rule[i] === "require") {
        if (!setting.formData[key].value) {
          setting.fail(setting.formData[key], rule[i])
          return
        }
      } else {
        if (!regular[rule[i]].test(setting.formData[key].value)) {
          setting.fail(setting.formData[key], rule[i])
          return
        }
      }
    }
  }
  setting.success()
}

/**
 * 获取表单数据
 * @param {object} options 配置信息
 * @param {string} el jquery选择器
 * @param {function} error 验证失败回调方法
 * @param {function} success 成功回调
 * @param {function} fail 失败回调
 */
export function getData(options) {
  const setting = $.extend({
    el: "",
    error: function(item, reason) {
      if (reason === "require") {
        tips("请输入" + item.name)
      } else {
        tips(item.name + "格式不正确")
      }
    },
    success: function() {},
    fail: function() {}
  }, options)
  const formData = getFormData(setting.el)
  verification({
    formData: formData,
    success: function() {
      const result = {}
      for (let key in formData) {
        result[key] = formData[key].value
      }
      setting.success(newFormData)
    },
    fail: function(item, reason) {
      setting.error(item, reason)
      setting.fail(formData)
    }
  })
}

/**
 * 设置表单数据
 * @param {object} options 配置信息
 * @param {string} el jquery选择器
 * @param {object} formData 表单数据
 */
export function setData(options) {
  var setting = $.extend({
    el: "",
    formData: {}
  }, options)
  const formDomList = getFormItemList(setting.el)
  for (let key in setting.formData) {
    if (formDomList[key]) {
      switch (formDomList[key].nodeName) {
        case "INPUT":
        case "TEXTAREA":
          formDomList[key].dom.val(setting.formData[key])
          break
        case "IMG":
          formDomList[key].dom.attr("src", setting.formData[key])
          break
        default:
          formDomList[key].dom.text(setting.formData[key])
          break
      }
    }
  }
}

/**
 * 验证码计时器
 * @param {object} options 配置信息
 * @param {string} el jquery选择器
 */
export function verificationCodeTime(options){
  const config = $.extend(
    {
      el: "",
      time: 60,
      text: "获取验证码"
    },
    options
  );
  config.$dom = $(config.el);
  config.$dom.css({ "pointer-events": "none" });
  const stopKey = setInterval(function() {
    config.$dom.text(setting.time + "S");
    if (config.time < 0) {
      clearInterval(stopKey);
      config.$dom.text(config.text);
      config.$dom.css({ "pointer-events": "all" });
    }
    config.time--;
  }, 1000);
}