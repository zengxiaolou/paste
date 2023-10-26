# Electron-ClipBoard-Manager(ECM)

## 简介
  这是一个由Electron + React + ArcoDesign 实现的剪切板管理工具。目前仅支持MacOS，但在不久的将来，将会陆续支持Windows和Linux。现在还在开发
  初期，各种缺陷会有很多，但是作者会持续修复，发现缺陷请在issue中添加，作者将使用空余时间修复。
  PS： UI借鉴了 PasteNow

## 开发
  目前项目结构还未完全优化完成，所以开发环境还不是特别理想，项目结构的调整将在MacOS端功能完善后进行调整

  > Node: 18.18.0  Electron: 27.0.0  React: 18.2.0  ArcoDesign: 2.53.2

### 初始化
  ```shell
    install yarn // 项目更目录下运行
    cd app/renderer/scr/main/
    install yarn // 渲染进程初始化
  ```
### 运行
  ``` shell
    yarn start  // 启动主进程&渲染进程
  ```
  ```shell
    yarn start:main //启动主进程
    yarn start:renderer //启动渲染进程
  ```
### 打包
  ``` shell
    yarn dist
  ```

## 应用截图

![](docs/screenshot.png)

## 下一个版本功能
- 支持Window、Linux 基础功能
- 完善菜单
- 增加右键菜单

## 更新日志
#### v0.0.1 (2023-10-27)
这是第一个版本，非常粗糙，但是剪切板该有的基础功能已经有了（MacOS）
我将争取在11月前，完成对Linux和Windows的基础功能进行支持
目前已经实现功能
- 剪切板监听，并存入数据库
- i18n支持
- 复制来源icon获取
- 双击实现剪切板内容复制
- 文本搜索功能
- 内容分类
- 呼出快捷键实现
- 部分菜单功能
- 收藏功能
