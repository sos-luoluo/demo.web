# 介绍
- Demo是一个网站开发的解决方案，它易于使用和部署。对于刚入门的人员来说是一个非常好的方案。它集成了jquery、juicer、众多的工具方法等。对于不使用vue等框架的开发人员，希望本项目能帮助到你。
- 本项目不支持低版本浏览器。
- 本项目不适用于二次开发。

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

## base 基础方法

## components 组件

## config 配置文件

## constants 静态数据

## cookie 缓存的操作方法

## form 表单操作方法

## jqueryfn jQuery插件

## mobile H5页面相关方法

## templateFn 模板工具辅助方法注册

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
