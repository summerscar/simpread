---
title: 浏览器要原生实现 React 的并发更新了？
date: 2023-08-30 13:29:47
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7270902621065412664)

大家好，我卡颂。

要说`React`有什么其他框架没有的、独一无二的特性，那一定是**并发更新**。围绕并发更新，存在两个很有意思的现象：

*   很多开发者听说过他
    
*   很少开发者直接使用过他
    

这两个现象看似矛盾，其实很好解释 —— `React`18 之后的新特性，主要是面向上层框架的（主要是`Next.js`）。

换句话说，这些新特性（比如并发更新）主要是供框架集成，而不是开发者直接使用。

比如，并发更新的两个核心`API` —— `useTransition`和`useDeferredValue`，都是针对**视图切换**的场景。

而在前端交互中，最主要的**视图切换**场景就是**路由切换**，所以包含路由功能的前端框架就会集成这两个`API`。

而现在，一个试验性浏览器`API` —— `View Transitions API`将原生实现**视图切换**功能。

他到底有什么用？如果其他框架使用它，是不是能获得`React`同样的并发更新能力？

欢迎围观朋友圈、加入[人类高质量前端交流群](https://juejin.cn/user/1943592291009511/pins "https://juejin.cn/user/1943592291009511/pins")，带飞

什么是视图切换？
--------

不管是`View Transitions API`，还是`React`的`useTransition`，都是为了提高**视图切换**场景下的用户体验。

什么是**视图切换**？以 [view-transitions Demo](https://link.juejin.cn?target=https%3A%2F%2Fmdn.github.io%2Fdom-examples%2Fview-transitions%2F%23 "https://mdn.github.io/dom-examples/view-transitions/#") 举例。这是个简单的相册`Demo`，点击左边图片缩略图，右边会显示大图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea4bba22259742b6997a3a53d042af20~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=320&h=240&e=gif&f=121&b=6e6c62)

整个过程简单来说包括 3 个步骤：

1.  点击缩略图
    
2.  请求大图数据
    
3.  大图请求成功后，显示大图
    

从步骤 1 到 3 的过程就是个典型的**视图切换**。整个过程有很多可以优化体验的地方，比如：

1.  从旧图到新图的渐变过渡效果
    
2.  点击缩略图发起图片请求后，大图区域可以先显示旧图（而不是立刻显示`loading`效果），待新图请求成功后再过渡到新图
    

这里解释下第二点，对于切换类的交互，相比于**当视图切换时立刻显示 loading 效果，待新视图加载完成后过渡到新视图**，**当视图切换时先显示旧视图，待新视图加载完成后过渡到视图**在延迟不高的情况下体验会更好。

除了上述这些**体验优化的点**，视图切换的实现还有很多细节需要考虑，比如：

*   如何处理新旧视图切换时的过渡效果？
    
*   如何处理新视图加载时的`loading`效果？
    
*   当正在请求新视图数据时（此时视图处在旧视图中），用户又对旧视图产生交互怎么办？
    
*   视图切换时如何处理页面滚动位置、光标聚焦（`focus`）位置？
    
*   对于使用屏幕阅读器的盲人，视图切换时阅读器会朗读什么？
    

除此之外，不同场景下的**视图切换**实现细节也不同。比如，如何在切换页面时优化视图切换效果？

在`SPA`（单页应用）出现之前，网站通常是由多个页面组成。比如下面网站的每个`Tab`栏，对应一个独立网页，其中：

*   `bramus Tab`对应 `https://http203-playlist.netlify.app/with-bramus/`
    
*   `cassie Tab`对应`https://http203-playlist.netlify.app/with-cassie/`
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad910c7cc756432e8b2a9353ba60bbea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1818&h=964&e=png&b=d6d3d3)

在`Tab`之间切换，浏览器会：

*   卸载之前的页面
    
*   请求新页面数据
    
*   加载新页面
    

从**页面卸载**到**页面加载**之间的白屏间隙会造成屏幕闪烁。

要优化这种场景下优化视图切换效果，当前唯一做法是利用`history API`接管路由操作，将网页变成一个`SPA`。

既然**视图切换**是如此常见的需求，且有这么多需要考虑的因素，那浏览器为什么不原生实现呢？

于是，`View Transitions API`应运而生。

> 当前`View Transitions API`不支持跨页面的视图切换，但未来会支持

View Transitions 的使用
--------------------

[View Transitions API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FView_Transitions_API "https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API") 的使用很简单，只需要用`document.startViewTransition`包裹视图切换后的回调函数即可。

对于上述相册示例，回调函数的逻辑是**将 img 标签 src 属性更新为新图片地址**：

```
const transition = document.startViewTransition(() => {
  galleryImg.src = /* 新图片地址 */;
});


```

剩下所有跟过渡相关的实现，都由`Transitions API`解决。

View Transitions 实现原理
---------------------

在视图切换时，存在 2 个概念：

*   切换前的旧视图
    
*   切换后的新视图
    

当使用`View Transitions`后，会依次做：

1.  对页面进行截图，作为旧视图
    
2.  执行传递给`document.startViewTransition`的回调
    
3.  `DOM`更新后，对更新后的页面进行截图，作为新视图
    
4.  构造一棵代表过渡效果的伪元素树，挂载在根元素（`html`元素）下，结构类似如下：
    

```
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      ├─ ::view-transition-old(root)
      └─ ::view-transition-new(root)


```

其中：

*   旧视图保存在`::view-transition-old(root)`中
    
*   新视图保存在`::view-transition-new(root)`中
    

对于上述相册示例，挂载的伪元素树结构如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e62e5b8937df4d5a92c0b27dcb1f5bc0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1110&h=428&e=png&b=ffffff)

之所以要挂载一棵伪元素树，主要是因为两个原因：

1.  开发者可以对微元素应用`CSS`规则

比如，上述两个**保存了新 / 旧视图的截图**的伪元素，类似于`img`标签，开发者可以对他们应用`CSS动画`，当新 / 旧视图切换时，实现自定义的过渡效果。

2.  方便对整个页面中不同**视图切换**分组

比如，在上述相册示例中，视图切换的元素包括两部分：

*   新 / 旧视图之间的切换（下图红框部分）
    
*   新 / 旧图片名称的切换（下图绿框部分）
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a586409a63f4c7daff1ffa8519ed42f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1502&h=976&e=png&b=77746a)

相册对应的`HTML`结构如下：

*   `img`标签对应视图部分（下图红框部分）
    
*   `figcaption`标签对应图片名称部分（下图绿框部分）
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18a01efa1c2e43f782aa112ce92086dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1356&h=428&e=png&b=ffffff)

当我们为`figcaption`元素设置不同的`view-transition-name`：

```
figcaption {
  view-transition-name: figure-caption;
}


```

会得到一棵新的伪元素树，其中**视图部分**和**图片名称部分**伪元素是分离开的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da8705dba4a94c1bbf351a4d897d6416~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1314&h=622&e=png&b=ffffff)

通过给页面中不同`HTML`元素定义不同的`view-transition-name`属性，就能独立控制这个元素是视图切换时的过渡效果。

与 React 的区别
-----------

浏览器原生的`View Transitions API`与`React`中的`useTransition`相比，谁更强大呢？

毫无疑问，前者更强大。

这是因为，对于`View Transitions API`，通过操作伪元素树，开发者可以自定义过渡效果（就像对`img`元素使用`CSS过渡动画`一样简单）。即使不使用`CSS Transition`，使用`JS Transition`也完全没问题。

`document.startViewTransition`方法会返回一个`transition`对象实例：

```
const transition = document.startViewTransition(() => {
  galleryImg.src = /* 新图片地址 */;
});


```

该实例包含了一系列视图切换生命周期对应的`promise`，比如：

*   `ViewTransition.ready`：伪元素树构造完成，准备开始过渡时
    
*   `ViewTransition.finished`：过渡效果完成后，此时新视图已经可以响应用户交互
    

而在`React`中，使用`useTransition`后，与其说完成的是**视图切换**，不如说完成的是：

1.  首先，完成状态的切换
    
2.  `React`内部再将状态变化映射到视图变化
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc5947ec1414bcaafdf46ddbbb2050a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1770&h=936&e=png&b=121212)

本质来说，操作视图的是`React`，而不是开发者。所以，开发者很难控制过渡效果。

动效库`Framer`的作者认为，由于开发者很难控制并发更新的完整生命周期，所以很难在并发更新时表达`animation`效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25c6d0fac6794d7e996121f1794b5ce5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1668&h=798&e=png&b=ffffff)

简单来说就是，开发者很难为并发更新定制过渡效果（用`CSS`或`JS`）。

总结
--

可以认为，`View Transitions API`是比`useTransition`抽象程度更高、开发者可控性更高的`API`。`useTransition`能实现的，他可以。`useTransition`不能实现的，他也可以。

要说缺点，`View Transitions API`是`Web`平台独有的，而`useTransition`依赖`React`核心的并发更新能力，是跨端的。

当前，`View Transitions API`的兼容性并不好：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a3e5f753e514f1fbbf8012c6e7806b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=2180&h=792&e=png&b=fdfdfd)

但是，一旦他变成可以大规模使用的`API`，那么其他前端框架只要接入他，就能轻松获得比`React`耗费大量精力实现的`useTransition`（以及底层的并发更新特性）更强大的视图切换能力。