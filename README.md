# 介绍
- Demo是一个网站开发的解决方案，它易于使用和部署。对于刚入门的人员来说是一个非常好的方案。它集成了jquery、juicer、众多的工具方法等。对于不使用vue等框架的开发人员，希望本项目能帮助到你。
- 本项目不支持低版本浏览器。
- 本项目不适用于二次开发。
- Manifest.appcache文件请依据项目实际情况进行配置，文件不会被主动打包到dist里，如要使用，请复制到项目到根目录下即可

# 安装

## 克隆项目
- git clone https://github.com/sos-luoluo/demo.web

## 安装依赖
- npm install

## 启动服务
- npm run dev

# 开发

## HTML
- index页面位置请勿移动，其余页面放入views文件夹即可
- HTML页面名字不能重复

## CSS
- 样式文件写在index.less里即可
- lib已封装常用的样式，可以直接使用

## 数据与事件绑定
- 页面加载过程一般有一个数据渲染和事件绑定的过程，在这些事情完成之后才会显示整个页面
- 数据绑定和事件绑定要返回一个Promise，用来控制加载进程
- 数据绑定可以将事件绑定所需要的参数通过Promise传递过去
- 事件绑定请尽量采用代理的方式

# 发布

- npm run build
- 将dist目录文件拷贝到项目目录即可

# 文档

## ajax 请求方法

### ajax
- 这是在jQuery ajax基础上进行二次封装的，请求支持success、fail回调，同时也会返回一个Promise,所以支持then、catch写法
- 参数除了jQuery ajax原本的逻辑外，封装了token，新增了几个参数：
1、id，当指定某个id时，这个请求会被锁定，只有请求完成后才会解锁，可以防止重复请求
2、hasLoading，ajax loading开关
3、confirmText，此值被指定是，会弹出一个确认信息，只有当用户点击确认后才会发送请求
### ListAjax
- 这个是一个列表请求方法，常用于列表请求使用，内部已经实现了滑动到底部自动加载，
- 除了常规的几个参数外，额外封装的参数有：
1、el：要使用列表渲染的元素，一般是列表包裹层
2、scrollBox：要监听的滚动元素，用于自动加载数据
- changeData：改变请求参数的方法，同名参数会被覆盖
- delData：删除某个参数方法
- changeURL：改变请求地址方法

## base 基础方法

### extend
- 合并对象方法，第一个参数传true的时候会执行深度合并

### isArray
- 判断一个对象是否为数组

### Deferred
- 延迟对象，使用方法同$.Deferred

### deferredAll
- 将多个延迟对象封装为一个

### random
- 随机数算法，可以自定义种子

### guid
- guid生成器

### serialize
- 序列化数据，在ajax中，某些时候需要手动序列化数据

### convertTree
- 列表数据转化为树形结构数据

### base64
- base64数据处理方法

### getFile
- 获取文件并转换为Blob对象

### WorkerManage
- WorkerManage多线程管理器，处理大量数据时可以考虑启用多线程处理，请配合work.js使用。
- handle：调用work里已注册函数的方法

## components 组件

### pageLoading
- 整个页面loading的控制方法

### ajaxLoading
- ajax请求loading的控制方法

### tips
- 显示一个提示信息，2s后消失

### modal
- 确认信息弹窗，可以绑定回调函数

### listStateChange
- 列表状态控制方法,请勿单独使用

## config 配置文件

### environment
- 项目环境配置，直接获取的webpack的配置

### version
- 程序版本控制

### projectInfo
- 项目配置

### ajaxConfig
- ajax请求相关配置

### pageConfig
- 页面配置

### mobileConfig
- H5移动端配置

### key
- key配置

## constants 静态数据

### NPCInfo
- 默认用户配置

### wordLib
- 字典库

### regular
- 正则表达式，如有需要可以增加

## cookie 缓存的操作方法

### cookie
- set： 设置cookie方法
- get： 获取cookie方法
- del： 删除cookie方法

### localStorage
- set： 设置缓存方法
- get： 获取缓存方法
- del： 删除缓存方法
- clear： 清空缓存方法

## form 表单操作方法

- 表单操作方法是获取表单数据、验证表单数据格式、设置表单数据的方法。使用该方法需要在表单中定义form-key(后台接受字段),form-name(字段名称),form-rule(验证规则，require表示必填)
- getData: 获取表单数据的方法，只有数据格式验证通过才能真正获取到数据
- setData： 设置表单数据的方法，不会验证数据格式
- verificationCodeTime： 表单中验证码的控制方法

## jqueryfn jQuery插件
- jQuery插件请在这里注册
- animateCss： animate动画插件
- isOnScreen： 判断元素是否在屏幕内的方法

## mobile H5页面相关方法
- 当网页运行于手机等移动端时，需要做一些配置
- setPageSize： 设置页面尺寸，会初始化rem值，页面大小宽度等
- pageCtrl：这是一个自己封装的H5页面栈进出的控制方法，如果需要配合animate实现切换的动画效果，如果有问题，可以使用swiper,效果会更好些

## templateFn 模板工具辅助方法注册
- 由于art-template不兼容最新的nodejs，已弃用，目前项目用juicer
- 注意juicer的默认边界符已被更改
- juicer的过滤器需要在这里注册使用，项目中已注册了两个方法
- timeFormat：时间格式化
- priceformat：价格格式化

## tools 工具

## worker JS多线程支持方法

# License

MIT License

Copyright (c) 2019-present luoluo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
