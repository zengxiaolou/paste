# Electron-ClipBoard-Manager(ECM)

## 简介
  这是一个由Electron + React + ArcoDesign 实现的剪切板管理工具。目前macOS已实现所有功能，Windows和Linux 实现了核心功能，但页面待进行优化。
  接下来将重点对Windows和Linux进行优化。希望大佬们给一些建议，使这个工具更加的完善。
  PS： UI借鉴了 PasteNow

## 开发
  项目未使用electron相关脚手架，所以整体不是太好，现在整体已经开发完了，接下来会投入时间对整个架构进行优化

  > Node: 18.18.0  Electron: 27.0.0  React: 18.2.0  ArcoDesign: 2.53.2

### 初始化
  ```shell
    yarn init:all // 安装主进程和渲染进程的依赖
  ```
### 运行
  ``` shell
    yarn start:mac  // 在macOS中启动主进程&渲染进程
    yarn start:win  // 在windows中启动主进程&渲染进程
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

![](docs/paste.png)
![](docs/setting.png)
![](docs/image.png)
![](docs/Link.png)

## 下一个版本功能
- 快捷选中功能
- 优化windows和linux页面展示
- 修复右键未点击功能报错
- 粘贴内容根据需求黏贴富文本/纯文本
- 主进程使用resolvePath 代替复杂相对路径
- preload改为ts


## 更新日志

#### v1.0.0(2023-11-19)
- 数量统计展示
- 增加链接打开功能
- 增加Image详情视图
- 增加husky
- 取消linux和windows上的菜单
- 取消frame

#### v0.0.3(2023-11-17)
- 完善菜单/设置界面功能开发
  - 常规设置
    - 开机自动启动
    - 复制音效
    - 语言选择
  - 快捷键设置
    - 快速唤醒/隐藏
    - tab页切换
    - 重置快捷键
  - 高级设置
    - 老数据删除定时删除
  - 关于
    - 更新设置
- 重复逻辑判断优化
- 删除/收藏功能优化（新增内容未无id导致）
- 图片复制bug修复
- 更换图标

#### v0.0.2 (2023-10-30)
- windows支持图标获取，linux基础复制黏贴功能完成
- 右键菜单采用electron系统菜单
- 增加代码检测
- 修改重复检测逻辑为10条队列
- 置顶失败bug修复

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
