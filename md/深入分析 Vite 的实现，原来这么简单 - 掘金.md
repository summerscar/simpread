---
title: 深入分析 Vite 的实现，原来这么简单 - 掘金
date: 2023-07-04 13:51:27
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7161672525666058276)

*   极速的服务启动，使用原生的 ESM 文件，无需打包。
*   轻量快速的热重载，无论应用程序大小如何，都始终极快的模块热替换（HMR）。
*   丰富的功能，对 TypeScript、JSX、CSS 等支持开箱即用。
*   优化构建，可选 “多页应用” 或 “库” 模式的预配置 Rollup 构建
*   通用的插件， 在开发和构建之间共享 Rollup-superset 插件接口。
*   完全类型化的API，灵活的 API 和完整的 TypeScript 类型。
*   ...

Vite，基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。

Vite 总结一下，最大的特点就是：

*   基础 ESM，实现快速启动和模块热更新。
*   在服务端实现按需编译。

开发者在代码中写到的 ESM 导入语法会直接发送给服务器，而服务器也直接将 ESM 模块内容运行处理后，下发给浏览器。接着，现代浏览器通过解析 script module，对每一个 import 到的模块进行 HTTP 请求，服务器继续对这些 HTTP 请求进行处理并响应。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e64ed5f6f43945b5aeee6d92d5a16467~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

那 Vite 是如何做到这一切的了？我们一起来分析一下。

准备工作
====

首先用 create-vue 创建一个 vite + vue3 的项目，安装依赖， npm run dev 把 vite 的开发服务跑起来。

```
kotlin复制代码`npm init vue@3

npm install

npm run dev`
```

然后从 github 把 vite 源码下载下来，目的是方便源码的分享。还有一个目的是为源码调试做准备。调测教程可看[这里](https://juejin.cn/book/7070324244772716556/section/7159194044663332872 "https://juejin.cn/book/7070324244772716556/section/7159194044663332872")。由于 vite 现在有多个版本，本文分析的源码都以当前最新源码为准。

注意：Vite 现在有 v1、v2、v3 三个大的版本。从 [vite@2.x](https://link.juejin.cn?target=mailto%3Avite%402.x "mailto:vite@2.x") 开始 vite 不使用 koa来创建服务和管理中间件了，而是使用connect。原因在于，[vite@2.x](https://link.juejin.cn?target=mailto%3Avite%402.x "mailto:vite@2.x") 更多基于 hooks 的插件的方式，对于 koa 中间件的需求大幅度减少，从依赖成本上看， connect 方便轻巧已经可以满足要求。如果你想去查阅源码，每一个版本都可以。

Vite 实现原理分析
===========

现在我们创建的项目已经跑起来了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd39e6724ca246739479eccf0e496791~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

我们启动项目是使用`npm run dev`，那这个命令发出之后，进行了什么处理了？

npm run dev 做了什么？
-----------------

找到 vite 中的源代码，vite 首先通过 `cac` 作为简单的参数解析器，来对我们运行的命令参数进行解析。`cac`是一个用于构建 CLI 应用程序的 JavaScript 库。

```
ini复制代码`const cli = cac('vite');`
```

`cac`这里简单在插一嘴，非常的实用，具有：

*   **超轻量级**：没有依赖，只有一个文件。
*   **易于学习**。构建简单的 CLI 只需要学习 4 个 API cli.option cli.version cli.help cli.parse：.
*   **却如此强大**。启用默认命令、类 git 子命令、验证所需参数和选项、可变参数、点嵌套选项、自动帮助消息生成等功能。
*   **开发人员友好**。用 TypeScript 编写。

大家如果有 CLI 应用程序的需要可以用用它。

vite 利用 `cac`生成了很多命令的入口，根据不同的命令行命令，执行不同的入口函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6bafec8a11447009c72e353567fea76~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

[源代码地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Fblob%2Fmain%2Fpackages%2Fvite%2Fsrc%2Fnode%2Fcli.ts "https://github.com/vitejs/vite/blob/main/packages/vite/src/node/cli.ts")

当执行`npm run dev`时就会 `cli dev 的 action` 回调。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ae4caadb8d043aa821d2a99066f2a87~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

通过`runServe 方法`，启动了一个 Server，来实现对浏览器请求的响应。通过 `connect`创建服务，Connect 是一个用于节点的可扩展 HTTP 服务器框架。在 [vite@1.x](https://link.juejin.cn?target=mailto%3Avite%401.x "mailto:vite@1.x") 是使用 koaServer 来启动服务，[vite@2.x](https://link.juejin.cn?target=mailto%3Avite%402.x "mailto:vite@2.x") 开始更多基于 hooks 的插件的方式，减少 koa 中间件的使用。所以 从 [vite@2.x](https://link.juejin.cn?target=mailto%3Avite%402.x "mailto:vite@2.x") 开始 vite 不使用 koa 来创建服务和管理中间件了，而是使用connect。

`runServe 方法`调用 `createServer 方法`，该执行做了很多工作，如整合配置项、创建 http 服务、创建 WebSocket 服务、创建源码的文件监听、插件执行、optimize 优化等。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fdea75a9fc24498b46642ca08111546~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这里`runServe 方法`具体的操作，有兴趣的同学可以去调试一下，看看发生了什么，调试的教程看[这里](https://juejin.cn/book/7070324244772716556/section/7159194044663332872 "https://juejin.cn/book/7070324244772716556/section/7159194044663332872")。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b8d9193a761416ea8ca950da1df1a61~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

服务启动，然后实现对浏览器请求的响应。

预构建
---

当你首次启动 vite 时，vite 会将预构建的依赖缓存到 node_modules/.vite。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03e19f46c292474e9a319308260fc0d5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aee0a9b3b68645558b7fa046fb10e901~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

它根据几个源来决定是否需要重新运行预构建步骤:

*   package.json 中的 dependencies 列表
*   包管理器的 lockfile，例如 package-lock.json, yarn.lock，或者 pnpm-lock.yaml
*   可能在 vite.config.js 相关字段中配置过的

只有在上述其中一项发生更改时，才需要重新运行预构建。

如果出于某些原因，你想要强制 vite 重新构建依赖，你可以用 --force 命令行选项启动开发服务器，或者手动删除 node_modules/.vite 目录。

预构建过程其实有两个目的：

*   CommonJS 和 UMD 兼容性: 开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。

*   性能： Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。


接着我们在浏览器访问启动的服务。

index.html
----------

浏览器在访问，`http://127.0.0.1:5173/`后，得到了响应主体。

```
xml复制代码`<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta  />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
```

这里有两个`script type="module"`第一个是 vite 给我们添加上的，我们后面再讲，第二个是我们添加的。

根据 ESM 规范在浏览器脚本请求中的实现。当出现 script 标签 type 属性为 module 时，浏览器将会请求模块相应内容。

当然 ESM 规范也可以将这里写成这样的形式。

```
python复制代码`<script type="module">
  import xxx from '/src/main.js‘
</script>`
```

浏览器依然会发起 HTTP 请求，请求 HTTP Server 托管的脚本。接下往下，浏览器发现请求，请求`main.js`。

main.js
-------

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e9b8b1a6c6a4d49bf4cc1f228874c19~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

如果认真观察就会发现和我们源码是不太一样的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7126e9d84434a529483c1bffa88a039~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

最大的不一样就是，import { createApp } from 'vue' 改为 import { createApp } from '/node_modules/.vite/deps/vue.js?v=19dbb026'。原因在于 import 对应的路径只支持 `"/"`、`"./"`或者`"../"`开头的内容，直接使用模块名 import，会立即报错。

vite 是怎么实现的了？

当我们进行浏览器访问时，vite 拦截到请求`http://localhost:5173/src/main.js`，然后获取请求的所有内容，

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b0b954bed424a47b67d83b7317e20df~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

```
python复制代码`'import { createApp } from 'vue'\nimport App from './App.vue'\nimport router from './router'\n\nimport './assets/main.css'\n\nconst app = createApp(App)\n\napp.use(router)\n\napp.mount('#app')\n'`
```

接着对请求的内容通过 `es-module-lexer`和`magic-string`这两个库对模块的路径进行重写。

es-module-lexer：JS 模块语法词法分析器

magic-string：字符替换

也就将 import 直接导入的模块进行了转义。也就是预构建的缓存`node_modules/.vite`中。

```
bash复制代码`'import { createApp } from '/node_modules/.vite/deps/vue.js?v=19dbb026'\nimport App from '/src/App.vue'\nimport router from '/src/router/index.js'\n\nimport '/src/assets/main.css'\n\nconst app = createApp(App)\n\napp.use(router)\n\napp.mount('#app')\n'`
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0c2deea0d8f4e78bd6b4494fd792215~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

最后根据 main.js 的内容，进行资源的请求：

```
arduino复制代码`'/node_modules/.vite/deps/vue.js?v=19dbb026'
'/src/App.vue'
'/src/router/index.js'
'/src/assets/main.css'`
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b098d8e8f01c4b40ae1720a1fdd89190~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

App.vue
-------

对 /src/App.vue 类请求进行处理，这就涉及 Vite 服务器的编译能力了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ede8ede037e1403b99238632bc736348~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这其实和我们写的源码完全不一样，当 vite 拦截到 App.vue 的请求时，

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/849e330256ec471fb85bf676fa6deead~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

会对其内容进行获取，然后通过转换方法进行转换。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91f5e38ff0dc476790457b2519ed5f2c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

对于 .vue 这样的单文件组件，内容会有 script、style 和 template，在经过 Vite Server 处理时，服务端对 script、style 和 template 三部分分别处理。对于具体的编译处理实现，我这里不过多的赘述。对应中间件关键内容可在源码 plugin-vue 中找到。

*   单文件组件中，对于 style 部分的编译，编译为对应 style 样式的 import 请求。
*   单文件组件中，对于 template 部分的编译，编译为对应 template 样式的 import 请求。

总而言之，每一个 .vue 单文件组件都被拆分成多个请求。不同的请求，会有不同的 type，执行不同的解析操作。然后将其解析后的内容进行返回。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1846b9469f94c82bbc5a812eed9cfd6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

整体来说：

*   vite 利用浏览器原生支持 ESM，省略了对模板的打包过程，这和 webpack 完全不同，所以在初次启动是非常的快的。
*   在更新时，由于浏览器原生支持 ESM，也不需要打包，所以对 HRM 也是非常的友好。
*   在 vite 开发模式下，在服务端完成模块的改写和请求处理，将业务代码中的 import 第三方依赖路径转为浏览器可识别的依赖路径，对 .ts、.vue 等文件进行即时编译，对 Sass/Less 的需要预编译的模块进行编译，浏览器端建立 socket 连接，实现 HMR，实现真正的按需编译。

接下来在看说说 vite 的 HRM 更新机制。

Vite HRM
========

对于 HRM ，不管是 webpack 还是 vite，主要的原理都是通过监听模块内容的变动来响应浏览器。而 vite 的 HMR 特性，可总结为三步：

1.  启动服务时，通过 watcher 监听文件改动。
2.  模块变动时，通过服务端编译资源，推送新模块内容给浏览器。
3.  浏览器收到新的模块内容，执行框架层面的重渲染。

而这一切的始作俑者就是在 index.html 中有一段引入 /vite/client 代码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b94afcc0c11142479519689477feb886~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc6f1d463afe4f63858e7dc82f439d1d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这段代码是 `vite`给我们添加上的，它是干什么的了？

它的目的就是进行 WebSocket 的注册和监听。在浏览器端通过 WebSocket 监听了一些更新的类型：

*   vue 组件更新
*   vue template 更新
*   vue style 更新
*   css 更新
*   css 移除
*   js 更新
*   页面 roload
*   ...

来触发更新操作，服务端通过创建的 watcher 来监听文件的改动，然后做出相应的处理操作，当处理完之后，发布变动，通知到浏览器。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d65b0b53c8d4406cbf8758327d0278e5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

总结
==

在浏览器支持 ES 模块之前，JavaScript 并没有提供的原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。

然而，当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。我们开始遇到性能瓶颈 —— 使用 JavaScript 开发的工具通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用 HMR，文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。

本文，通过流程分析了 Vite 的实现，分析了 Vite 如何利用 ESM，整体流程来看，原来它这么简单。

事实上，Vite 依赖优化的灵感来自 Snowpack，这类 bundleless 工具也代表着一种新趋势、新方向，希望大家一起共勉学习起来。

参考
==

*   [cn.vitejs.dev/](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2F "https://cn.vitejs.dev/")
*   [github.com/cacjs/cac#r…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcacjs%2Fcac%23readme "https://github.com/cacjs/cac#readme")
*   [github.com/senchalabs/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsenchalabs%2Fconnect "https://github.com/senchalabs/connect")
*   [github.com/guybedford/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fguybedford%2Fes-module-lexer "https://github.com/guybedford/es-module-lexer")
*   [juejin.cn/book/707032…](https://juejin.cn/book/7070324244772716556/section/7159194044663332872 "https://juejin.cn/book/7070324244772716556/section/7159194044663332872")
*   [github.com/Rich-Harris…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FRich-Harris%2Fmagic-string "https://github.com/Rich-Harris/magic-string")
*   [github.com/vitejs/vite…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Fblob%2Fc3ef4f64ec09c6916f4e6b9764362a23843b98b6%2Fsrc%2Fnode%2Fserver%2FserverPluginModuleRewrite.ts%23L120 "https://github.com/vitejs/vite/blob/c3ef4f64ec09c6916f4e6b9764362a23843b98b6/src/node/server/serverPluginModuleRewrite.ts#L120")
*   [www.vitejs.net/guide/dep-p…](https://link.juejin.cn?target=https%3A%2F%2Fwww.vitejs.net%2Fguide%2Fdep-pre-bundling.html%23customizing-the-behavior "https://www.vitejs.net/guide/dep-pre-bundling.html#customizing-the-behavior")
*   [kaiwu.lagou.com/course/cour…](https://link.juejin.cn?target=https%3A%2F%2Fkaiwu.lagou.com%2Fcourse%2FcourseInfo.htm%3FcourseId%3D584%23%2Fdetail%2Fpc%3Fid%3D5910 "https://kaiwu.lagou.com/course/courseInfo.htm?courseId=584#/detail/pc?id=5910")
*   [www.vitejs.net/guide/compa…](https://link.juejin.cn?target=https%3A%2F%2Fwww.vitejs.net%2Fguide%2Fcomparisons.html%23snowpack "https://www.vitejs.net/guide/comparisons.html#snowpack")
