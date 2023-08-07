---
title: 如何使用 TS  快速编写一个自己的 Github Action - 掘金
date: 2023-07-04 13:51:27
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7191357386139893817)

> 如果你的某项工作流程出现了多次重复性机械操作，那么你就该思考更好的优化手段了。

在工程化大行其道的当下，travis、jenkins、vercel 等 CICD 平台或工具的兴起有效简化了我们原有的一些手动网站部署的工作，我们只需要将代码推送到远端就能自动帮我们进行网站的构建与部署，非常方便。

笔者最开始使用的是 travis，只需要进行简单的几项配置之后，就能满足笔者更新完文档之后，自动构建并部署到 github-pages了。但其实用过 github-pages 的同学应该也感受过它那可叹的访问速度，所以笔者把目光投向了 vercel，它支持将你的项目构建并发布到 vercel 的服务上，相比于 github-pages，它的速度还是稍微快点的。

不过后来似乎 vercel 的站点开始被墙了，所以为了访问的考虑，笔者还是准备将网站部署到自己的服务器上，这样速度会更快点；不过这次笔者选择了更加方便的 github actions，能非常方便的定制自己的 pipeline，不用外接其他服务，同时还有很多好用的现成 action 可以直接集成，说干就干！

快速上手
----

GitHub Actions 是一种持续集成和持续交付(CI/CD) 平台，可用于自动执行生成、测试和部署管道。

这里放了一句官网给出的基础的介绍，大致知道下是个什么东西，更详细的概述可以 Google 一下，这里就不过多赘述了。

用白话文介绍下就是可以监听一些操作比如 push 或者 pr 之类的事件，然后给一个临时容器帮你跑一些命令进行构建部署之类的。

官方文档：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.github.com%2Fzh%2Factions%2Fquickstart "https://docs.github.com/zh/actions/quickstart")

### 创建一个基础的 workflow

首先你随便找一个自己的 github 仓库，在仓库下新建一个 .github 文件夹，然后再建一个 workflows 文件夹，再在这个 workflows 建一个 deploy.yml 文件，文件内容可大致如下：

```
yml复制代码`name: GitHub Actions Demo
run-name: Github Actions
on: [push] # 监听事件
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest # 运行的镜像
    steps:
      - run: echo "冲！" # 执行的命令
      - name: Check out repository code
        uses: actions/checkout@v3 # 拉取当前仓库代码到容器中`
```

这里简单设置了一下什么时候该执行该 workflow，然后声明了一下执行的容器为 ubuntu，也是比较常用的，然后你就能在 steps 下编写需要执行的具体步骤了，这里主要做了两件事，第一个 run 就是打印了一个 `冲！` 的日志，然后第二部就是借助了官方提供的 checkout action 来进行仓库的拉取，可以非常方便的把你当前仓库的代码拉到容器当前执行目录下，当然你也设置一些参数进行更精细化的控制，这里你直接翻阅他的文档就好了。

checkout actions 文档：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Factions%2Fcheckout "https://github.com/actions/checkout")

当然了，这里只是给大家一个基本的使用，具体的 workflow 的使用倒不是本文的重点，详细的介绍可以翻看官方给出的文档，后面笔者也会具体聊一些常用配置。

下面就让我们开始编写一个自己的 github action 吧。

### 创建一个 Action 仓库

第一步，打开你的 github，然后创建一个 git 仓库，接着拉到本地。

#### 基于模板仓库创建（推荐）

直接使用笔者提供的 action 仓库模板创建。

1.  打开模板仓库：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSTDSuperman%2Faction-template "https://github.com/STDSuperman/action-template")
2.  如图点击使用模板创建仓库 ![模板仓库创建](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f15a3237284a698769edb1b728cadc~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)
3.  将创建好的代码拉到本地

#### 手动初始化

1.  打开笔者的模板仓库：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSTDSuperman%2Faction-template "https://github.com/STDSuperman/action-template")
2.  复制仓库代码配置文件到你的仓库中

### 使用自己的 Action

如果你按照笔者上述初始化完成之后，项目根目录应该会有一个 `.github/workflow/test.yml` 文件，那么打开它可以看到如下代码：

```
yml复制代码`on: [push]

jobs:
  DeployTest:
    runs-on: ubuntu-latest
    name: TestJob
    steps:
      - uses: actions/checkout@v2 # 第一步，下载代码仓库

      - name: TestStep
        id: Test
        uses: STDSuperman/action-template@master # 运行你自己的 action
        with: # 给你的 action 传参
          host: 'aa.bb.cc.dd'`
```

这里主要看几个配置：

*   `on`: 指定在什么阶段运行你的 action
*   `runs-on`: 指定你运行的容器镜像，最终你的后续步骤会在这个容器里运行
*   `uses`: 该指令可以让你直接使用已有的 action 功能，如`actions/checkout@v2` 这个上文已经介绍过了，用来拉取当前项目仓库的。
*   `with`: 该指令可以用来给指定 action 进行传参，后面也会介绍，这里配了之后运行时可以通过 github 官方提供的工具库直接读取到。

好了，知道了如何使用已有的 action 之后，我们就可以配置下让他使用我们自己现在正在开发的 action 进行测试了，也就是下面那个 `uses: STDSuperman/action-template@master`，这里你需要改一下，把 `STDSuperman/action-template` 改成你自己的 github 用户名和你当前自定义 action 的仓库名，后面的 `@master` 表示的是直接用 master 分支的代码来运行，当然你也可以指定成你自己的打的 tag，比如 v1 啥的。

这里笔者直接用 master 分支来进行测试了，本地配置完之后，我们就可以直接 push 到远端仓库了，然后再打开你的 github 仓库，找到 Actions 这个 tab，下面就可以看到你的 action 在运行了，你可以点开查看你的日志，如果你用的是笔者的默认模板代码的话，应该可以看到打印出你传入的 host 参数值。

![Actions](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/341ce38dd126495db2fd6b201ece0dac~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### 配置 Action Secret

#### 为什么需要 Action Secret

在一些情况下，你需要给你自己的 action 或者是官方提供的 action 进行传参，但是又不想暴露自己的这部分私密数据，那么你就需要新建一个自己的 Secret ，并把传参方式改成从运行环境中读取，举个🌰：

```
yml复制代码`on: [push]

jobs:
  DeployTest:
    runs-on: ubuntu-latest
    name: TestJob
    steps:
      - uses: actions/checkout@v2 # 第一步，下载代码仓库

      - name: TestStep
        id: Test
        uses: STDSuperman/action-template@master # 运行你自己的 action
        with: # 给你的 action 传参
          host: ${{ secrets.SERVER_HOST }}`
```

还是以上面笔者提供的例子来改一下，上面我们是以明文传递的这个 host 参数，现在我们不想让别人看到我们的服务器地址，那么我就需要使用 Secret 这个功能了，读取方式就直接按上述示例 host 的取值方式，这里的 `SERVER_HOST` 就是你创建的 secret 名。

那么如何新建一个 secret 呢？往下走。

#### 新建新的 Action Secret

![创建 Secret](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d40c51b211294b618e22a749f1a830b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

如图所示，找到需要使用该 secret 的仓库，然后 新建一个 secret，name 就写你后续需要在 action 中读取的变量名，下方的内容就写你需要加密的值。

比如上面笔者的例子，笔者新建了一个名叫 `SERVER_HOST` 的 secret，然后把我的服务器 IP 放进去，然后再在 Action 中用 `secrets.SERVER_HOST` 访问就好了，这个 `secrets` 是运行时的环境变量，它会读取你创建的 Secret 然后放到这个对象中供你访问。

> 记住，这个 secret 是创建在你要用的那个仓库里的，也就是你编写 yml 文件的那个仓库，别创建到你开发的 action 仓库里了。

实战
--

### 使用 Action 进行网站部署

这里笔者将以一个简单的实战案例来带你玩转 github action。这个 action 其实也是笔者前段时间需要把自己的个人博客迁移到自己的服务器进行部署的时候写的一个工具，顺便也熟悉一下如何编写一个 github action。

同样的，你可以先基于上述创建好的模板仓库进行后续的代码开发。

### 基础功能

一个网站自动部署的 workflow 应该至少具备一下几种能力：

1.  拉取目标仓库代码
2.  node 环境准备 & 项目依赖安装
3.  代码构建
4.  产物推送到服务器
5.  在服务端执行一些命令

对于前三点，因为都是非常通用的能力，所以直接采用了官方提供的 action 或 workflow 的能力就能完成，所以自定义的 action 就主要实现后面两点。

前三点对应的 workflow 大致如下：

```
yml复制代码`name: Deploy Doc Site

on:
  push:
    branches:
      - master # 只在master上push触发部署
    paths-ignore: # 下列文件的变更不触发部署，可以自行添加
      - README.md
      - LICENSE

jobs:
  deploy:
    runs-on: ubuntu-latest # 使用ubuntu系统镜像运行自动化脚本

    steps: # 自动化步骤
      - uses: actions/checkout@v2 # 第一步，下载代码仓库

      - name: Set node version 16 # 第二步安装 node 环境
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install Deps # 安装项目依赖
        run: npm install

      - name: Build # 项目构建
        run: npm run build

      - name: Deploy to Server # 推文件
        id: DeployServer
        uses: STDSuperman/deploy-files@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          user: ${{ secrets.SERVER_USER }}
          port: '22'
          password: ${{ secrets.SERVER_PASSWORD }}
          targetPath: '/home/website/docs'
          sourcePath: './dist'`
```

如上所示，笔者给出的示例项目是自己的个人博客，一个纯前端的项目，故构建需要 node 环境，这里就直接使用了官方的 action 进行 node 环境安装，同时直接使用 steps run 的方式直接执行命令安装依赖和构建；最后就是执行笔者自己编写的 action 了。

### 构建产物推送

```
ts复制代码`// src/index.ts
import * as core from '@actions/core'
import { ScpClient } from './lib/scp-client'
import { logger } from './lib/logger'
import { parseCommandStr } from './utils'

export async function run(): Promise<boolean> {
  try {
    const host: string = core.getInput('host')
    const username: string = core.getInput('user')
    const password: string = core.getInput('password')
    const sourcePath: string = core.getInput('sourcePath')
    const targetPath: string = core.getInput('targetPath')

    const scpClient = new ScpClient({
      host,
      port: 22,
      username,
      password,
    })

    await scpClient.waitForReady()
    await scpClient.uploadDirectory(sourcePath, targetPath)

    await scpClient.close()
    return true
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      core.setFailed(error.message)
    }
  }
  return false
}

run()`
```

这里大致介绍下代码构建，首先从读取你在 yml 文件中定义的入参，读取方式为调用官方提供的包：`core.getInput` 方法，具体的值对应的也就是上述 yml 文件中 with 指令下面传的参数，这里以入参接入的方式的好处就是你的 action 可以给不同的仓库或者别人直接使用，只需要修改入参就好了。

参数解析：

*   `host`: 服务器 ip 地址
*   `user`: 服务器用户名
*   `port`: 服务器 ssh 的 服务端口，一般是 22
*   `password`: 服务器密码
*   `targetPath`: 需要推送到的服务器文件路径
*   `sourcePath`: 待推送的当前构建后的产物路径，相对于容器运行的根目录，笔者这里是当前容器运行目录下的 dist 目录

好了，这里通过 `core.getInput` 方法可以轻松拿到入参数据，然后就可以基于这些入参进行服务器的连接和推送了。

```
ts复制代码`const scpClient = new ScpClient({
  host,
  port: Number(port || 22),
  username,
  password,
})`
```

这里就实例化了一个 ScpClient 实例，主要是借用了 `ssh2` 这个 npm 包做了一层文件上传和检测的封装方法，感兴趣可以看笔者的源码：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSTDSuperman%2Fdeploy-files%2Fblob%2Fmaster%2Fsrc%2Flib%2Fscp-client.ts "https://github.com/STDSuperman/deploy-files/blob/master/src/lib/scp-client.ts")。

这块的具体核心逻辑如下

```
ts复制代码`import { Client as SSHClient, SFTPWrapper } from 'ssh2'

const ssh = new SSHClient()

ssh.on('ready', () => {
  ssh.sftp((err, sftp: SFTPWrapper) => {
    this.sftpWrapper = sftp

    // 读取笔者传入的 dist 目录下的所有文件
    const dirEntries = fs.readdirSync(src, {
      encoding: 'utf8',
      withFileTypes: true,
    })

    // 遍历所有文件，这里笔者把对文件夹的递归逻辑先干掉了，简化了一下
    for (const e of dirEntries) {
      const newSrc = path.join(src, e.name)
      const newDst = this.normalizeFilePath(dest, e.name)
      // 拼接后上传给服务器指定目录
      this.sftpWrapper.fastPut(sourcePath, targetPath, options || {})
    }
  })
})`
```

这里的代码进行了大量的简化，详细逻辑见笔者仓库源码。主流程就是读取要上传的所有文件，然后拼接路径，最终利用 ssh 的连接传给服务器。

### 服务端命令执行

为了每次新的构建都能完美替换掉旧的逻辑，或许你可能需要在推送新的文件前，把之前的产物都清理掉（不考虑清理之后和新的文件上传之前的访问 404 问题），那么就得提供一个可以执行命令的能力。

```
ts复制代码`const preCommandStr: string = core.getInput('preCommands')
const preCommands: string[] = preCommandStr?.split(/\n+/)`
```

这里首先读取一下在 yml 中设置的命令参数（`preCommands`），如下示例：

```
yml复制代码`- name: Deploy to Server # 第二步，rsync推文件
  id: DeployServer
  uses: STDSuperman/deploy-files@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    user: ${{ secrets.SERVER_USER }}
    port: '22'
    password: ${{ secrets.SERVER_PASSWORD }}
    targetPath: '/home/website/docs'
    sourcePath: './dist'
    preCommands:
      rm -rf /home/website/docs # clear old assets
      echo 'success'`
```

主要关注这个 `preCommands` 参数，传的值是以换行符分割的多个命令，所以上面给出的 action 使用示例里就需要 split 一下把多个命令解析出来运行。

这里的 `preCommands` 会在上传文件之前执行，所以你可以在这里做一些清理操作。

```
ts复制代码``// 调用 exec 函数
scpClient.exec(preCommands.join(' && '), '/home/test-dir')

// exec 方法主逻辑
const exec = (command: string, cwd: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    this.sshClient?.exec(`cd ${cwd} && ${command}`, {}, (err, channel) => {
      if (err) {
        reject(err)
        console.error('exec: ', err)
      }

      channel.on('exit', (...args) => {
        resolve()
      })
    })
  })
}``
```

拿到需要执行的命令之后，我们就可以使用上述介绍过的 scpClient 实例来进行服务器命令执行了，这个实例也是 `ssh2` 包提供的一系列与服务器交互的工具集提供的。

这里似乎笔者没找到它提供的 cwd 参数怎么传，也就是服务器命令执行的上下文路径，所以封装的 exec 方法你如果指定了 cwd 那么笔者就会给你的命令前面加一个 cd 到指定上下文的操作。

当然笔者也提供了上传完文件之后的后置命令执行参数，参数名为`commands`，用法同上 `preCommands`，具体代码实现就是等上传命令执行完之后再执行。

主流程完整代码如下

```
ts复制代码`import * as core from '@actions/core'
import { ScpClient } from './lib/scp-client'
import { logger } from './lib/logger'
import { parseCommandStr } from './utils'

export async function run(): Promise<boolean> {
  try {
    const host: string = core.getInput('host')
    const username: string = core.getInput('user')
    const password: string = core.getInput('password')
    const sourcePath: string = core.getInput('sourcePath')
    const port: string = core.getInput('port')
    const targetPath: string = core.getInput('targetPath')
    const commandStr: string = core.getInput('commands')
    const serverCwd: string = core.getInput('serverCwd') || '~'
    const preCommandStr: string = core.getInput('preCommands')
    const postCommands: string[] = parseCommandStr(commandStr)
    const preCommands: string[] = parseCommandStr(preCommandStr)

    const scpClient = new ScpClient({
      host,
      port: Number(port || 22),
      username,
      password,
    })

    await scpClient.waitForReady()

    if (preCommands?.length) {
      logger.log('start exec pre commands...')
      await Promise.all(
        preCommands.map((command) => scpClient.exec(command, serverCwd))
      )
      logger.log('pre command exec success!')
    }

    logger.log('start upload files...')
    await scpClient.uploadDirectory(sourcePath, targetPath)
    logger.log('upload success!')

    if (postCommands?.length) {
      logger.log('start exec commands...')
      await Promise.all(
        postCommands.map((command) => scpClient.exec(command, serverCwd))
      )
      logger.log('command exec success!')
    }

    await scpClient.close()

    return true
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      core.setFailed(error.message)
    }
  }
  return false
}

!process.env.TEST && run()`
```

完整网站部署 Action 源码地址：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSTDSuperman%2Fdeploy-files "https://github.com/STDSuperman/deploy-files")

### 自定义 Action 的项目配置文件解析

#### action.yml

```
yml复制代码`name: 'Deploy Files And Execute Command For Github Actions'
description: 'An action that deploys the files to the server and executes some commands.'
author: 'STDSuperman'
branding:
  icon: 'upload-cloud'
  color: 'orange'
runs:
  using: 'node16'
  main: 'dist/index.js'`
```

以笔者示例的项目为例，这里主要需要配置下name、description、 runs 指令，branding 这个主要是给你投到 github 的 action 市场的时候需要配的 icon 和颜色。

*   `name`: action 名字，跟用 action 的时候的那个 yml 里配置的 use 没关系，就是给你投到市场的 action 命名
*   `description`: 描述
*   `using`: 表示用什么环境来执行你的 action
*   `main`: 指定运行的入口文件路径

他这里有个注意点就是，他需要你指定的入口文件是一个完全 bundle 的也就是不依赖 node_modules 的构建好的提交上去的单文件，所以说，你的 .gitignore 就不能忽略 dist 目录，需要把他提交上去，作为最终容器运行的文件。

所以说你就需要有个能打成单文件的构建工具。

### Action 构建

官方文档倒是推荐了 ncc 这个工具来做单文件打包，笔者由于用 esbuild 用习惯了，所以项目配置了 esbuild 进行了打包能力，同时使用 husky 配置了提交之前自动执行构建的逻辑，避免你忘记构建提交上去发现改动的代码在运行时不生效问题。

具体的构建逻辑可参考下笔者示例项目下的 scripts/build.ts 文件。

核心逻辑如下：

```
ts复制代码`import esbuild from 'esbuild'
import path from 'path'
import NativeModulePlugin from './plugins/native-module-plugin'

esbuild.build({
  entryPoints: [path.resolve('src')],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  plugins: [NativeModulePlugin],
})`
```

主要就是使用了 esbuild 的 api 进行单文件打包，同时为了处理 .node 类型的原生模块，所以写了一个简单的插件进行打包，有兴趣可以参考下示例项目的实现，这里就不过多赘述了。

[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSTDSuperman%2Fdeploy-files "https://github.com/STDSuperman/deploy-files")

总结
--

笔者这里完整的介绍了一下如何使用 ts 开发一个实用的 action 流程，如果你更喜欢 js 的话，估计需要自行调整下 lint 配置和删除 tsconfig.json，或者直接删掉有关 lint 相关的文件或代码即可，然后 src 目录下新建一个 index.js 就好了。

如果文中存在尚不明确或错误的地方，感谢指正。
