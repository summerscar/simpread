---
title: The best of 2023’s CSS & UI features | by Yahia Berashish | Sep, 2023 | Stackademic
date: 2023-09-18 13:49:46
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.stackademic.com](https://blog.stackademic.com/the-best-of-2023s-css-ui-features-7448c6855c14)

> An overview of the most exciting new CSS & UI features of 2023.

If you have ever used CSS before, you almost certainly have worked with media queries.

They enable you to create responsive layouts by adding breakpoints based on the width of the viewport from which the user is currently using your website.

But there was a problem: You couldn’t add breakpoints to a specific container, you had to add them based only on the viewport itself, which complicated the process of responsive web development by forcing you to a fixed number of breakpoints across the whole application, and that’s the problem [container queries](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries) aim to solve.

With [container queries](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries) – which are supported across all modern browsers – you can label an element as a container, and then apply styles to its children based on its size.

```
.my-container{
  container: my-container / inline-size;
}

.child{
  background-color: red;
}

@container my-container (width <= 500px){
  .child{
    background-color: blue;
  }
}

```

Layers and scoping are revolutionary features for organizing your CSS.

Using layers, you can specify which styles should be prioritized, and with scoping, you can specify the scope that the styles will affect.

```
/* layers.css */

@layer base{

  /* styles scoped to .card element */
  @scope (.card){

    .body{
      background-color: white;
      border: 1.5px solid #aaa;
    }

    .title{
      color: black;
    }

  }

}

@layer dark{
  @scope (.card){

    .body{
      background-color: black;
    }

    .title{
      color: white;
    }

  }
}

```

```
/* style.css */

/*
“base” styles will be overridden
by “dark” styles since they are 
*/
@layer base, dark;

```

```
<div class=”card”>
  <h3 class=”title”>
    card title
  </h3>
  <div class=”body”>
    …
  </div>
<div/>

```

Some of the most exciting new features are ones allowing you to control the UI in ways that would’ve required JavaScript to work, including:

Popover API
-----------

The popover API provides built-in popover functionality with event handlers, a declarative DOM structure, and accessible defaults.

```
<div popover>
  …
</div>

<button popovertarget="event-popup">Create New Event</button>

```

Anchor positioning
------------------

[**Anchor positioning**](https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning/) is a new CSS API that enables anchor positioning between two elements.

To solve the problem of menus overflowing out of the screen, the API includes a fallback position that you can customize.

```
.center-tooltip {
  position-fallback: --top-then-bottom;
  translate: -50% 0;
}

@position-fallback --top-then-bottom {
  @try {
    bottom: calc(anchor(top) + 0.5rem);
    left: anchor(center);
  }

  @try {
    top: calc(anchor(bottom) + 0.5rem);
    left: anchor(center);
  }
}

```

<selectmenu>
------------

[**<selectmenu>**](https://developer.chrome.com/blog/whats-new-css-ui-2023/#selectmenu) is a customizable dropdown menu component, for when you want to style content inside of a select.

```
<selectmenu>
  <button slot="button" behavior="button">
    <span>Select event type</span>
    <span behavior="selected-value" slot="selected-value"></span>
    <span><img src="icon.svg"/></span>
  </button>
  <option value="meeting">
    <figure></figure>
    <p>Meeting</p>
  </option>
  <option value="break">
    <figure></figure>
     <p>Lunch/Break</p>
  </option>
  ...
</selectmenu>

```

The new updates also include some exciting additions to transitions and animations, including:

Discrete property transitions
-----------------------------

Previously, properties like “display” couldn't be animated, but with [**discrete property transitions**](https://developer.chrome.com/blog/whats-new-css-ui-2023/#discrete-property-transitions), such properties can be animated.

This is particularly useful for animating the newly added popovers and selectmenus.

Scroll-driven animations
------------------------

[**Scroll-driven animations**](https://developer.chrome.com/articles/scroll-driven-animations/) allow you to control the playback of animation based on the scroll position of the scroll container, making things like parallax backgrounds and reading indicators a lot easier to implement.

```
@keyframe scroll-animation{...}

.container{
  animation: scroll-animation linear;
  animation-timeline: scroll(root block);
}

```

```
const element = document.querySelector("#my-element");
element.animate(
  {
    transform: ["scale(0)", "scale(1)"]
  },
  {
    fill: "forwards",
    timeline: new ScrollTimeline({
      source: document.documentElement,
    })
  }
)

```

View transitions
----------------

[**The View Transition API**](https://developer.chrome.com/docs/web-platform/view-transitions/) makes it easy to change the DOM in a single step while creating an animated transition between the two states, giving you the ability to easily implement page transitions in Single-Page Apps (SPAs), but Multi-page apps (MPAs) support is being currently worked on.

```
function spaNavigate(data) {
  // Fallback for browsers that don't support this API:
  if (!document.startViewTransition) {
    updateTheDOMSomehow(data);
    return;
  }

  // With a transition:
  document.startViewTransition(() => updateTheDOMSomehow(data));
}

```

```
@keyframes slide-from-right {
  from { opacity: 0; transform: translateX(75px); }
}

@keyframes slide-to-left {
  to { opacity: 0; transform: translateX(-75px); }
}

::view-transition-old(root) {
  animation: 350ms both slide-to-left ease;
}

::view-transition-new(root) {
  animation: 350ms both slide-from-right ease;
}

```