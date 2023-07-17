> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [developer.chrome.com](https://developer.chrome.com/en/blog/scroll-animation-performance-case-study/)

[#](#whats-new-with-scroll-driven-animations) What’s new with scroll-driven animations?
---------------------------------------------------------------------------------------

[Scroll-driven animations](/articles/scroll-driven-animations/) are a way to add interactivity and visual interest to your website or web application, triggered by the user's scroll position. This can be a great way to keep users engaged and make your website more visually appealing.

<video src="" control></video>

In the past, the only way to create scroll-driven animations was to respond to the scroll event on the main thread. This caused two major problems:

*   Scrolling is performed on a separate process and therefore delivers scroll events asynchronously.
*   Main thread animations are [subject to jank](/blog/inside-browser-part3/#updating-rendering-pipeline-is-costly).

This makes creating performant scroll-driven animations that are in-sync with scrolling impossible or very difficult.

We are now introducing a [new set of APIs](/articles/scroll-driven-animations/#scroll-driven-animations) to support scroll-driven animations, which you can use from CSS or JavaScript. The API tries to use as few main thread resources as possible, making scroll-driven animations far easier to implement, and also much smoother.

This article compares the new approach with the classic JavaScript technique to show just how easy and silky-smooth scroll-driven animations can be with the new API.

[#](#the-scroll-driven-animations-css-api-versus-classic-javascript) The scroll-driven animations CSS API versus classic JavaScript
-----------------------------------------------------------------------------------------------------------------------------------

The following example progress bar is built using class JavaScript techniques.

<video src="" control></video>

The document responds each time the `scroll` event happens to calculate how much percentage of the `scrollHeight` the user has scrolled to.

```
document.addEventListener("scroll", () => {  
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;  
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;  
  var scrolled = (winScroll / height) * 100;   
  document.getElementById("progress").style.width = scrolled + "%";  
})
```

The following demo shows the same progress bar using the new API with CSS.

<video src="" control></video>

```
@keyframes grow-progress {  
  from {  
    transform: scaleX(0);  
  }  
  to {  
    transform: scaleX(1);  
  }  
}  
  
#progress {  
  animation: grow-progress auto linear forwards;  
  animation-timeline: scroll(block root);  
}
```

The new [animation-timeline](/articles/scroll-driven-animations/#animation-timelines) CSS feature, automatically converts a position in a scroll range into a percentage of progress, therefore doing all the heavy-lifting.

Now here’s the interesting part—let’s say that you implemented a super-heavy calculation on both versions of the website that would eat up most of the main thread resources.

```
function someHeavyJS(){  
  let time = 0;  
  window.setInterval(function () {  
    time++;  
    for (var i = 0; i < 1e9; i++) {  
      result = i;  
    }  
    console.log(time)  
  }, 100);  
}
```

As you might have expected, the classic JavaScript version becomes janky and sluggish due to the main thread resources junction. On the other hand, the CSS version is completely unaffected by the heavy JavaScript work and can respond to the user's scroll interactions.

<video src="" control></video>

See the Pen <a href="https://codepen.io/nyb1030/embed/gOBvZgR">Pen gOBvZgR by nyb1030 on Codepen</a>See the Pen <a href="https://codepen.io/nyb1030/embed/xxyYmgx">Pen xxyYmgx by nyb1030 on Codepen</a>

The CPU usage is completely different in DevTools, as shown in the following screenshots.

![Main thread comparison.](https://wd.imgix.net/image/HodOHWjMnbNw56hvNASHWSgZyAf2/v6rDNCu6XO8Nh5ujx0yw.png?auto=format)

The following demo shows an application of scroll driven animation created by [CyberAgent](https://www.cyberagent.co.jp/en/). You can see that the photo fades in as you scroll.

See the Pen <a href="https://codepen.io/herablog/embed/dygjeQE">Pen dygjeQE by herablog on Codepen</a>

[#](#new-scroll-driven-animations-javascript-api-versus-classic-javascript) New scroll-driven animations JavaScript API versus classic JavaScript
-------------------------------------------------------------------------------------------------------------------------------------------------

The benefit of the new API is not only limited to CSS. You are able to create silky smooth scroll-driven animations using JavaScript as well. Take a look at the following example:

```
const progressbar = document.querySelector('#progress');  
progressbar.style.transformOrigin = '0% 50%';  
progressbar.animate(  
  {  
    transform: ['scaleX(0)', 'scaleX(1)'],  
  },  
  {  
    fill: 'forwards',  
    timeline: new ScrollTimeline({  
      source: document.documentElement,  
    }),  
  }  
);
```

This enables you to create the same progress bar animation shown in the previous CSS demo using just JavaScript. The underlying technology is the same as the CSS version. The API tries to use as few main thread resources as possible, making the animations far smoother when compared to the classic JavaScript approach.

Also, this new API works in conjunction with the existing [Web Animations API (WAAPI)](https://drafts.csswg.org/web-animations-1/) and [CSS Animations API](https://drafts.csswg.org/css-animations-1/) to enable declarative scroll-driven animations.

<video src="" control></video>

See the Pen <a href="https://codepen.io/nyb1030/embed/gOBvZgR">Pen gOBvZgR by nyb1030 on Codepen</a>See the Pen <a href="https://codepen.io/nyb1030/embed/MWPLgbe">Pen MWPLgbe by nyb1030 on Codepen</a>

[#](#more-demos-and-resources) More demos and resources
-------------------------------------------------------

You can check out the different implementations of scroll driven animation via this [demo site](https://scroll-driven-animations.style/), where you can compare demos using these new APIs from CSS and JavaScript.

If you are interested in learning more about the new scroll-driven animations, check out this [article](/articles/scroll-driven-animations/) and the [I/O 2023 talk](https://youtu.be/oDcb3fvtETs?t=337)!