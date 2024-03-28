---
title: CSS Wrapped 2023! |  Blog  |  Chrome for Developers
date: 2023-12-11 11:29:22
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [developer.chrome.com](https://developer.chrome.com/blog/css-wrapped-2023?hl=en)

> 2023 was a huge year for CSS! Learn about what landed in Chrome and across the web platform this year......

*   [Chrome for Developers](https://developer.chrome.com/)
*   [Blog](https://developer.chrome.com/blog)

CSS Wrapped: 2023!
==================

@import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap'); :root { --accent: hsl(156deg 100% 50% / 50%); --copy-width: clamp(1rem, 3.5vw, 1.25rem); --copy-code: clamp(1rem, 3.5vw, 1.2rem); --copy-max-width: 72ch; --media-max: 100ch; --headingA-size: clamp(2.2rem, 8vw, 4rem); --headingB-size: clamp(1.5rem, 6vw, 2rem); --bgcopy-1: #fff; --bgcopy-3: #f4f5f6; --copy-secondary-text-color: #202124; --hr-border: 1px solid #f4f5f6; /* copying custom props bc you cant use devsite properties or get blocking errors*/ --display-font: 400 64px/72px var(--headline-font-family); --headline-font-family: 'Dela Gothic One', Google Sans, Noto Sans, Noto Sans JP, Noto Sans KR, Noto Naskh Arabic, Noto Sans Thai, Noto Sans Hebrew, Noto Sans Bengali, sans-serif; /* fixes body gradient from being cutoff */ height: auto; } :root [appearance=dark] { --bgcopy-1: #0d0d0d; --bgcopy-3: #1e1e21; --copy-secondary-text-color: #afb2b6; --h3-border: 1px solid #1e1e21; } @media (prefers-color-scheme: dark) { :root [appearance=device] { --bgcopy-1: #0d0d0d; --bgcopy-3: #1e1e21; --copy-secondary-text-color: #afb2b6; --h3-border: 1px solid #1e1e21; } } @keyframes slide-fade-in { from { opacity: 0; transform: translateY(5vh); } } @keyframes parallax { to { background-position: 0 75svh; } } body { overflow-x: hidden; } @supports (animation-timeline: scroll()) { @media (prefers-reduced-motion: no-preference) { body { animation: parallax linear both; animation-timeline: scroll(); animation-range: 0px 150svh; } body[ready] .devsite-wrapper.devsite-wrapper { overflow: initial; } .devsite-article-body > div > * { view-timeline-name: --item-timeline; animation-name: slide-fade-in; animation-fill-mode: both; animation-timeline: --item-timeline; animation-range: cover 0% cover 15%; } } } body { background: radial-gradient(30vw circle at 125px 300px in oklab, color(display-p3 0 0 1 / 25%), transparent), radial-gradient(40vw circle at 90vw 50vh in oklab, color(display-p3 1 0 1 / 25%), transparent), radial-gradient(30vw circle at 30vw 45vh in oklab, color(display-p3 0 1 1 / 25%), transparent); background-repeat: no-repeat; } .devsite-main-content { /* cant override devsite custom props, recreating here */ max-width: 1360px; } .highlight { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 0.2rem; text-decoration-style: wavy; text-decoration-skip-ink: none; font-weight: 500; font-size: 1.5rem; } @media (min-width: 480px) { .baseline-key::before { margin-top: 0.2rem; font-size: 1.5em; } } .baseline-key-img { height: 1em; vertical-align: middle; } .devsite-article p:empty { display: none; } .devsite-article p, .devsite-article li { line-height: 1.5; font-size: var(--copy-width); max-width: var(--copy-max-width); } .devsite-article code, .devsite-article aside { line-height: 1.4; font-size: var(--copy-code); } .devsite-article aside { margin-inline: 0; } .devsite-article devsite-selector>section { padding: 0; } .devsite-article:not(#id) devsite-selector figure { margin: 0; } .devsite-article tab a { font-size: 1rem; } .no-margin { margin: 0 !important; } .hero { margin-block-end: clamp(2rem, 7vw, 6rem); margin-block-start: -1rem; } .center { margin: 0 auto; display: block; } devsite-selector video, devsite-selector img { height: auto; max-height: 80vh; width: auto; } code { background: var(--accent); } .devsite-article h1:first-of-type { display: none } .devsite-article .devsite-page-title.real-pagetitle { display: inline; margin-top: 0; vertical-align: middle; } .devsite-article h1, .devsite-article h2 { font: var(--display-font); font-size: var(--headingA-size); overflow: visible; } .devsite-article h1, .devsite-article h2 { line-height: 1.2; } .baseline-new:before { background-image: url(css-wrapped-2023/image/baseline_new.svg); } .baseline-no:before { background-image: url(css-wrapped-2023/image/baseline_no.svg); } .baseline-no:before, .baseline-new:before { content: ''; width: 3rem; height: 1em; display: inline-block; background-size: contain; background-repeat: no-repeat; background-position: bottom; vertical-align: bottom; margin-inline-end: 0.5rem; } /* Undoing Page Styling from DevSite */ /* Remove blog header */ .devsite-collapsible-section { display: none; } body[layout=docs] .devsite-article { border: none; } [theme=chrome-theme] .devsite-article .caption { font-size: 1rem; margin: 1rem auto; width: calc(100% - 2rem); max-width: var(--copy-max-width); } [theme=chrome-theme] .devsite-article figure figcaption { font-size: inherit; } /* Remove TOC bc it will get long on mobile */ /* Remove article meta to feel more like a landing page */ /* devsite-toc, .devsite-sidebar, */ .devsite-article-meta, .devsite-page-date, .devsite-page-title { display: none; } .lg-top-spacing { margin-block-start: 10vw; } /* Jump Links */ .link-lists { --document-gutter: 80px; display: grid; gap: 1rem; grid-auto-flow: column; grid-auto-columns: max-content; align-items: start; width: 100vw; overflow-x: auto; scroll-snap-type: x mandatory; padding-block-end: 1rem; padding-inline: var(--document-gutter); scroll-padding-inline: var(--document-gutter); position: relative; left: 50%; margin-left: -50vw; } @media screen and (max-width: 840px) { .link-lists { --document-gutter: 24px; } .devsite-article devsite-code { margin-inline: -24px; } } @media screen and (max-width: 600px) { .link-lists { --document-gutter: 16px; } .devsite-article devsite-code { margin-inline: -16px; } } .link-lists ul { background: #f8f8f855; border: 1px solid lightgray; border-radius: 1rem; padding-inline-end: 1.5rem; padding-block-end: .5rem; scroll-snap-align: start; } [appearance] .link-lists > ul:nth-child(1) { border-color: color(display-p3 1 0 0) } [appearance] .link-lists > ul:nth-child(2) { border-color: color(display-p3 1 0 1) } [appearance] .link-lists > ul:nth-child(3) { border-color: color(display-p3 0 0 1) } [appearance] .link-lists > ul:nth-child(4) { border-color: color(display-p3 0 1 1) } [appearance] .link-lists > ul:nth-child(5) { border-color: color(display-p3 0 1 0) } [appearance] .link-lists > ul:nth-child(6) { border-color: color(display-p3 1 1 0) } [appearance="dark"] .link-lists ul { background: #20212455; border-color: #303134; } [appearance=dark] .baseline-key a:hover { color: white; } @media (prefers-color-scheme: dark) { [appearance="device"] .link-lists ul { background: #20212455; border-color: #303134; } } @media (min-width: 1360px) { .link-lists { /* vw - max-main-content - (padding = 80px * 2) */ --document-gutter: calc((100vw - 1360px + 160px) / 2); } } @media (min-width: 2250px) { .link-lists { overflow: hidden; } } /* Body background color */ [appearance="device"], [appearance="light"] { background-color: var(--bgcopy-1); } [appearance="dark"] { background-color: var(--bgcopy-3); } @media (prefers-color-scheme: dark) { [appearance="device"] { background-color: var(--bgcopy-3); } } @media (max-width: 720px) { .devsite-article devsite-code { margin-inline: 0; } } /* Sticky headers */ .devsite-article h3 { font-size: var(--headingB-size); position: sticky; top: 48px; animation-timeline: none; /* Prevent SDA */ z-index: 1; padding: 20px 0; } .devsite-article h3::after { content: ""; width: 100vw; background: var(--bgcopy-1); /* Match body background */ position: absolute; inset: 0; margin-left: 50%; transform: translateX(-50%); z-index: -1; border-bottom: var(--h3-border); } .devsite-article a { scroll-margin-top: 10rem; } /* Sticky headers: Dark Mode (System + Forced) */ @media (prefers-color-scheme: dark) { [appearance="device"] .devsite-article h3::after { background: var(--bgcopy-3); } } [appearance="dark"] .devsite-article h3::after { background: var(--bgcopy-3); } .link-lists a { color: var(--copy-secondary-text-color); } .link-lists li:not(.section-head) { font-size: 1rem; line-height: 1; } .section-head { list-style: none; margin-left: -1rem; font-weight: 600; } .dcc-browser-compat { flex-wrap: wrap; gap: .5em 1em; } .dcc-browser-compat > :is(p, li) { margin-block: 0; } .dcc-browser-compat > p:last-of-type { flex-shrink: 0; } .dcc-browser-compat > ul { padding-inline: 0; flex-wrap: wrap; row-gap: 0.5em; } .dcc-browser-compat > ul > li { margin-block: 0; } :is(div.hero, div.lg-top-spacing) img { width: 100%; } ![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_header.svg)

CSS Wrapped: 2023!
==================

Jump to content:

*   [Architectural foundations](#architecture)
*   [Trigonometric functions](#trig)
*   [Complex nth-* selection](#nth)
*   [Scope](#scope)
*   [Nesting](#nesting)

*   [Typography](#typography)
*   [Initial-letter](#initial-letter)
*   [Text-wrap balance/pretty](#textwrap)

*   [Color](#color)
*   [Color level 4](#color-4)
*   [Color-mix function](#color-mix)
*   [Relative color syntax](#rcs)

*   [Responsive design](#responsive)
*   [Container queries](#container-queries)
*   [Style queries](#style-queries)
*   [:has selector](#has)
*   [Update media query](#update-mq)
*   [Scripting media query](#scripting-mq)
*   [Transparency media query](#transparency-mq)

*   [Interaction](#interaction)
*   [View transitions](#view-transitions)
*   [Linear-easing function](#linear-easing)
*   [Scrollend](#scroll-end)
*   [Scroll-driven animations](#scroll-animations)
*   [Deferred timeline attachment](#deferred)
*   [Discrete property transitions](#discrete-animations)
*   [Starting-style rule](#starting-style)
*   [Overlay animation](#overlay)

*   [Components](#components)
*   [Popover](#popover)
*   [Hr in select](#hrselect)
*   [User-valid/invalid pseudo classes](#user-states)
*   [Exclusive accordion](#named-details)

Wow! 2023 was a huge year for CSS!

From [#Interop2023](https://wpt.fyi/interop-2023) to many new landings in the CSS and UI space that enable capabilities developers once thought impossible on the web platform. Now, every modern browser supports container queries, subgrid, the `:has()` selector, and a whole plethora of [new color spaces and functions](https://developer.chrome.com/docs/css-ui/high-definition-css-color-guide). We have support in Chrome for CSS-only [scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) and smoothly animating between web views with [view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/). And to top it all off, there are so many new primitives that have landed for better developer experiences like [CSS nesting](https://developer.chrome.com/docs/css-ui/css-nesting) and [scoped](https://developer.chrome.com/articles/at-scope/) styles.

What a year it has been! And so we’d like to end this milestone year celebrating and acknowledging all of the hard work by browser developers and the web community that made this all possible.

Look out for the new Baseline badges next to the feature headers! [Learn more here.](https://web.dev/blog/baseline-definition-update)

*   ![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/baseline_new.svg) = Newly available in all stable versions of major browsers.

*   ![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/baseline_no.svg) = Partial availability in browser engines.


![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_foundations.svg)

[Architectural foundations](#architecture)
------------------------------------------

Let's begin with updates to the core CSS language and capabilities. These are features which are foundational to the way you author and organize styles, and bring great power to the hands of the developer.

### [Trigonometric functions](#trig)

Browser Support

*   111
*   111
*   108
*   15.4

[Source](https://developer.mozilla.org/docs/Web/CSS/cos)

Chrome 111 added support for the trigonometric functions `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, and `atan2()`, making them available across all major engines. These functions come in very handy for animation and layout purposes. For example, it's now much easier to lay out elements on a circle around a chosen center.

Trigonometric functions demo

Learn more about [the trigonometric functions in CSS](https://web.dev/articles/css-trig-functions).

### [Complex nth-* selection](#nth)

Browser Support

*   111
*   111
*   113
*   9

With [the `:nth-child()` pseudo-class selector](https://web.dev/learn/css/pseudo-classes#nth_child_and_nth_of_type) it's possible to select elements in the DOM by their index. Using the [`An+B` microsyntax](https://www.w3.org/TR/css-syntax-3/#anb-microsyntax) you get fine control over which elements you want to select.

By default the `:nth-*()` pseudos take all child elements into account. As of Chrome 111 you can, optionally, pass a selector list into `:nth-child()` and `:nth-last-child()`. That way you can prefilter the list of children before `An+B` does its thing.

In the following demo, the `3n+1` logic is applied only to the small dolls by prefiltering them out using `of .small`. Use the dropdowns to dynamically change the used selector.

Complex nth-* selection demo

Learn more about [complex nth-* selections](https://developer.chrome.com/articles/css-nth-child-of-s/).

### [Scope](#scope)

Browser Support

*   118
*   118
*   x
*   x

Chrome 118 added support for `@scope`, an at-rule that lets you scope selector matching to a specific subtree of the document. With scoped styling, you can be very specific about which elements you select without having to write overly-specific selectors or tightly coupling them to the DOM structure.

A scoped subtree is defined by a _scoping root_ (the upper boundary) and an optional _scoping limit_ (the lower boundary).

```
@scope (.card) { … } /* scoping root */
@scope (.card) to (.card__content) { … } /* scoping root + scoping limit*/


```

Style rules placed inside a scope block will only target elements within the carved out subtree. For example, the following scoped style rule only targets `<img>` elements that sit between `.card` element and any nested component matched by the `[data-component]` selector.

```
@scope (.card) to ([data-component]) {
  img { … }
}


```

In the following demo, the `<img>` elements in the carousel component are not matched because of the applied scoping limit.

[Scope Demo Screenshot](#scope-demo-screenshot)[Scope Live Demo](#scope-live-demo)[More](#)

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/at-scope.png)

CSS `@scope` demo

Find out more about `@scope` in the article ["How to use `@scope` to limit the reach of your selectors"](https://developer.chrome.com/articles/at-scope/). In this article you'll learn about the `:scope` selector, how specificity gets handled, prelude-less scopes, and how the cascade is affected by`@scope`.

### [Nesting](#nesting)

Browser Support

*   112
*   112
*   117
*   16.5

[Source](https://developer.mozilla.org/docs/Web/CSS/Nesting_selectors)

Before nesting, every selector needed to be explicitly declared, separately from one another. This leads to repetition, stylesheet bulk and a scattered authoring experience. Now, selectors can be continued with related style rules grouped within.

```
dl {
  /* dt styles */

  dt {
    /* dl dt styles */
  }

  dd {
    /* dl dd styles */
  }
}

/* same as */
dt {
  /* dt styles */
}

dl dt {
  /* dl dt styles */
}

dl dd {
  /* dl dd styles */
}


```

[Nesting Screencast](#nesting-screencast)[Nesting Live Demo](#nesting-live-demo)[More](#)

 <video src="" control></video>



Change the relaxed nesting selector to decide the winner of the race

Nesting can reduce the weight of a stylesheet, reduce the overhead of repeating selectors, and centralize component styles. The syntax initially released with a limitation that required usage of `&` in various places, but since has been lifted with a [nesting relaxed syntax update](https://developer.chrome.com/blog/css-nesting-relaxed-syntax-update/).

Learn more about [nesting](https://developer.chrome.com/articles/css-nesting/).

### [Subgrid](#subgrid)

Browser Support

*   117
*   117
*   71
*   16

[Source](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid)

CSS `subgrid` enables you to create more complex grids with better alignment between child layouts. It allows a grid that's inside another grid, to adopt the rows and columns of the outer grid as its own, by using `subgrid` as a value for grid rows or columns.

[Subgrid Screencast](#subgrid-screencast)[Subgrid Live Demo](#subgrid-live-demo)[More](#)

 <video src="" control></video>



Header, body and footers align to the dynamic sizes of their siblings.

Subgrid is especially useful for aligning siblings to each other's dynamic contents. This frees copywriters, UX writers, and translators from attempting to create project copy that"fits" into the layout. With subgrid, the layout can be adjusted to fit the content.

Learn more about [subgrid](https://web.dev/articles/css-subgrid).

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_typography.svg)

Typography
----------

Web typography saw a few key updates in 2023. An especially nice progressive enhancement is the `text-wrap` property. This property enables typographic layout adjustment, composed in the browser with no additional scripting required. Say goodbye to awkward line lengths and hello to more predictable typography!

### [Initial-letter](#initial-letter)

Browser Support

*   110
*   110
*   x
*   9

[Source](https://developer.mozilla.org/docs/Web/CSS/initial-letter)

Landing at the start of the year in Chrome 110, the `initial-letter` property is a small yet powerful CSS feature which sets styling for the placement of initial letters. You can position letters in either a dropped or raised state. The property accepts two arguments: the first for how deeply to drop the letter into the corresponding paragraph, and second for how much to raise the letter above it. You can even do a combination of both, such as in the following demo.

[Initial-letter Screenshot](#initial-letter-screenshot)[Initial-letter Demo](#initial-letter-demo)[More](#)

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/initial-letter.png)

Change the values of the `initial-letter`for the `::first-letter` pseudo element to watch it shift.

Learn more about [initial-letter](https://developer.chrome.com/blog/control-your-drop-caps-with-css-initial-letter/).

### [text-wrap: balance and pretty](#textwrap)

As a developer, you don't know the final size, font size, or even language of a headline or paragraph. All the variables needed for an effective and aesthetic treatment of text wrapping, are in the browser. Since the browser _does_ know all the factors, like font size, language, and allocated area, it makes it a great candidate for handling advanced and high quality text layout.

This is where two new text wrapping techniques come in, one called `balance` and the other `pretty`. The `balance` value seeks to create a harmonious block of text while `pretty` seeks to prevent orphans and ensure healthy hyphenation. Both of these tasks have traditionally been done by hand, and it's amazing to give the job to the browser and have it work for any translated language.

[Text-wrap Screencast](#text-wrap-screencast)[Text-wrap Live Demo](#text-wrap-live-demo)[More](#)

 <video src="" control></video>



In the following demo you can compare by dragging the slider, the effects of `balance` and `pretty` on a heading and a paragraph. Try translating the demo into another language!

Learn more about [text-wrap: balance](https://developer.chrome.com/blog/css-text-wrap-balance/).

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_color.svg)

[Color](#color)
---------------

2023 was the year of color for the web platform. With new color spaces and functions that enable dynamic color theming, there's nothing stopping you from creating the vivid, lush themes your users deserve, and make them customizable, too!

### [HD Color Spaces (Color Level 4)](#color-4)

Browser Support

*   111
*   111
*   113
*   15

[Source](https://developer.mozilla.org/docs/Web/CSS/color_value/color)

Browser Support

*   111
*   111
*   113
*   15

[Source](https://developer.mozilla.org/docs/Web/CSS/color_value/lch)

From the hardware to the software, the CSS to the blinking lights; it can take a lot of work for our computers to try and represent colors as good as our human eyes can see. In 2023, we have new colors, more colors, new color spaces, color functions and new capabilities.

CSS and color can now: - Check if the users screen hardware is capable of wide gamut HDR colors. - Check if the user's browser understands color syntax like Oklch or Display P3. - Specify HDR colors in Oklab, Oklch, HWB, Display P3, Rec.2020, XYZ, and more. - Create gradients with HDR colors, - Interpolate gradients in alternative color spaces. - Mix colors with `color-mix()`. - Create color variants with relative color syntax.

[Color 4 Screencast](#color-4-screencast)[Color 4 Demo](#color-4-demo)[More](#)

 <video src="" control></video>



In the following demo you can compare by dragging the slider, the effects of `balance` and `pretty` on a heading and a paragraph. Try translating the demo into another language!

Learn more about [Color 4 and color spaces](https://developer.chrome.com/articles/high-definition-css-color-guide/).

### [color-mix function](#color-mix)

Browser Support

*   111
*   111
*   113
*   16.2

[Source](https://developer.mozilla.org/docs/Web/CSS/color_value/color-mix)

Mixing color is a classic task and in 2023 CSS can do it too. You can not only mix white or black to a color, but also transparency, and do all this in any color space of your choosing. It's simultaneously a basic color feature and an advanced color feature.

[color-mix() Screencast](#color-mix-screencast)[color-mix() Demo](#color-mix-demo)[More](#)

 <video src="" control></video>



Demo allows you to pick two colors with a color picker, the color space, and how much of each color should be dominant in the mix.

You can think of `color-mix()` as a moment in time from a gradient. Where a gradient shows all the steps it takes to go from blue to white, `color-mix()` shows just one step. Things get advanced once you begin to take color spaces into account and learn just how different the mixing color space can be to the results.

Learn more about [color-mix()](https://developer.chrome.com/blog/css-color-mix/).

### [Relative color syntax](#rcs)

Relative color syntax (RCS) is a complementary method to `color-mix()` for creating color variants. It's slightly more powerful than color-mix() but also a different strategy for working with color. `color-mix()` may mix in the color white to lighten a color, where RCS gives precise access to the lightness channel and the ability to use `calc()` on the channel to reduce or increase lightness programmatically.

[RCS Screencast](#rcs-screencast)[RCS Live Demo](#rcs-live-demo)[More](#)

 <video src="" control></video>



Change the color, change the scenes. Each uses relative color syntax to create variants off the base color.

RCS allows you to perform relative and absolute manipulations to a color. A relative change is one where you take the current value of saturation or lightness and modify it with `calc()`. An absolute change is one where you replace a channel value with an entirely new one, like setting opacity to 50%. This syntax gives you meaningful tools for theming, just in time variants, and more.

Learn more about [relative color syntax](https://developer.chrome.com/blog/css-relative-color-syntax/).

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_responsive.svg)

[Responsive Design](/blog/css-wrapped-2023/responsive)
------------------------------------------------------

Responsive design evolved in 2023. This groundbreaking year enabled new features that entirely change the way we build responsive web experiences, and ushered in a new model of component-based responsive design. The combination of container queries and `:has()` supports components that own their responsive and logical styling based on the size of their parent, as well as the presence or state of any of their children. That means you can finally separate page-level layout from component-level layout, and write the logic once to use your component everywhere!

### [Size container queries](#container-queries)

Browser Support

*   105
*   105
*   110
*   16

[Source](https://developer.mozilla.org/docs/Web/API/CSSContainerRule)

Rather than using the viewport's global size information to apply CSS styles, container queries support the querying of a parent element within the page. This means components can be styled in a dynamic way across multiple layouts and in multiple views. Container queries for size became stable in all modern browsers on Valentine's Day this year (February 14th).

To use this feature, first set up containment on the element you are querying, and then, similar to a media query, use `@container` with the size parameters to apply the styles. Along with container queries you get container query sizes. In the following demo, the container query size `cqi` (representing the size of the inline container), is used to size the card header.

[@container Screencast](#container-screencast)[@container Demo](#container-demo)[More](#)

 <video src="" control></video>

Learn more about using [container queries](https://web.dev/blog/cq-stable).

### [Style container queries](#style-queries)

Browser Support

*   111
*   111
*   x
*   x

[Source](https://developer.mozilla.org/docs/Web/CSS/@container)

Style queries landed with partial implementation in Chrome 111. With style queries currently, you can query the value of custom properties on a parent element when using `@container style()`. For example, query if a custom property value exists, or is set to a certain value, such as `@container style(--rain: true)`.

[Style query screenshot](#style-query-screenshot)[Style query demo](#style-query-demo)[More](#)

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/stylecq.png)

Change the color, change the scenes. Each uses relative color syntax to create variants off the base color.

While this sounds similar to using class names in CSS, style queries have some advantages. The first is that with style queries, you can update the value in CSS as needed for pseudo states. Also, in future versions of the implementation, you'll be able to query ranges of values to determine the style applied, such as `style(60 <= --weather <= 70)`, and style based on property-value pairs such as `style(font-style: italic)`.

Learn more about using [style queries](https://developer.chrome.com/blog/style-queries/).

### [:has() selector](#has)

Browser Support

*   105
*   105
*   121
*   15.4

[Source](https://developer.mozilla.org/docs/Web/CSS/:has)

For almost 20 years developers asked for a "parent selector" in CSS. With the `:has()` selector that shipped in Chrome 105 this is now possible. For example, using `.card:has(img.hero)` will select the `.card` elements that have a hero image as a child.

[:has() Demo Screenshot](#:has-demo-screenshot)[:has() Live Demo](#:has-live-demo)[More](#)

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/has-demo-1.png)

CSS `:has()` demo: Card without/with image

Because `:has()` accepts a relative selector list as its argument, you can select much more than the parent element. Using various CSS combinators, it's possible to not only go up the DOM tree, but also do sideway selections. For example, `li:has(+ li:hover)` will select the `<li>` element that precedes the currently hovered `<li>` element.

[:has() Screencast](#:has-screencast)[:has() Demo](#:has-demo)[More](#)

 <video src="" control></video>



CSS `:has()` demo: Dock

Learn more about [the CSS `:has()` selector](https://developer.chrome.com/blog/has-m105/).

### [Update media query](#update-mq)

Browser Support

*   113
*   113
*   102
*   17

[Source](https://developer.mozilla.org/docs/Web/CSS/@media/update-frequency)

The `update` media query gives you a way to adapt UI to the refresh rate of a device. The feature can report a value of `fast`, `slow`, or `none` which relates to the capabilities of different devices.

Most of the devices you design for are likely to have a fast refresh rate. This includes desktops and most mobile devices. eReaders and devices such as low powered payment systems, may have a slow refresh rate. Knowing that the device can't handle animation or frequent updates, means that you can save battery usage or faulty view updates.

[Update Screencast](#update-screencast)[Update Demo](#update-demo)[More](#)

 <video src="" control></video>



Simulate (by choosing a radio option) an update speed value and see how it affects the duck.

Learn more about [@media (update)](https://developer.chrome.com/blog/css-update-media-query/).

### [Scripting media query](#scripting-mq)

Browser Support

*   120
*   120
*   113
*   17

[Source](https://developer.mozilla.org/docs/Web/CSS/@media/scripting)

The scripting media query can be used to check whether or not JavaScript is available. This is very nice for progressive enhancement. Before this media query, a strategy for detecting if JavaScript was available was to place a `nojs` class in the HTML, and remove it with JavaScript. These scripts can be removed as CSS now has a way to detect JavaScript and adjust accordingly.

Learn how to [enable and disable JavaScript on a page for testing via Chrome DevTools here](https://developer.chrome.com/docs/devtools/javascript/disable/).

[Scripting Screencast](#scripting-screencast)[Scripting Demo](#scripting-demo)[More](#)

 <video src="" control></video>

Consider a theme switch on a website, the scripting media query can assist in making the switch work against the system preference since no JavaScript is available. Or consider a switch component—if JavaScript is available then the switch can be swiped with a gesture instead of just toggled on and off. Lots of great opportunities to upgrade UX if scripting is available while providing a meaningful foundation experience if scripting is disabled.

Learn more about [script](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting).

### [Reduced-transparency media query](#transparency-mq)

Browser Support

*   118
*   118

*   x

[Source](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-transparency)

Non-opaque interfaces can cause headaches or be a visual struggle for various types of vision deficiencies. This is why Windows, macOS, and iOS have system preferences that can reduce or remove transparency from the UI. This media query for `prefers-reduced-transparency` fits in well with the other preference media queries, which allow you to be creative while also adjusting for users.

[Reduced Transparency Screencast](#reduced-transparency-screencast)[Reduced Transparency Demo](#reduced-transparency-demo)[More](#)

 <video src="" control></video>

In some cases, you can provide an alternative layout which doesn't have content overlaying other content. In other cases, the opacity of a color can be adjusted to be opaque or nearly opaque. The following blog post has more inspiring demos that adapt to the user preference, give them a look if you're curious about times when this media query is valuable.

Learn more about [@media (prefers-reduced-transparency)](https://developer.chrome.com/blog/css-prefers-reduced-transparency/).

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_interactions.svg)

[Interaction](#interaction)
---------------------------

Interaction is a cornerstone of digital experiences. It helps users get feedback on what they clicked on and where they are in a virtual space. This year, there have been many exciting features landing which have made interactions easier to compose and implement, enabling smooth user journeys and a more finessed web experience.

### [View transitions](#view-transitions)

Browser Support

*   111
*   111
*   x
*   x

[Source](https://developer.mozilla.org/docs/Web/API/Document/startViewTransition)

View transitions have a huge impact on the user experience of a page. With the View Transitions API, ​​you can create visual transitions between two page states of your Single Page Application. These transitions can be full page transitions, or smaller things on a page such as adding or removing a new item to a list.

At the core of the View Transitions API is the `document.startViewTranstion` function. Pass in a function that updates the DOM to the new state, and the API takes care of everything for you. It does this by taking a before and after snapshot, then transitioning between the two. Using CSS you can control what gets captured and optionally customize how these snapshots should be animated.

[VT Screencast](#vt-screencast)[VT Demo](#vt-demo)[More](#)

 <video src="" control></video>



View Transitions demo

The View Transitions API for Single Page Applications shipped in Chrome 111. Learn more about [View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/).

### [Linear-easing function](#linear-easing)

Browser Support

*   113
*   113
*   112
*   x

Don't let the name of this function fool you. The `linear()` function (not to be confused with the `linear`keyword) allows you to create complex easing functions in a simple manner, with the compromise of losing some precision.

Before `linear()`, which shipped in Chrome 113, it was impossible to create bounce or spring effects in CSS. Thanks to `linear()`it is possible to approximate these easings by simplifying them to a series of points, then linearly interpolating between these points.

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/linear-easing-function-bounce.svg) The original bounce curve in blue is simplified by a set of key points shown in green. The `linear()` function uses these points and interpolates linearly between them. [Linear-easing Screencast](#linear-easing-screencast)[Linear-easing Demo](#linear-easing-demo)[More](#)

 <video src="" control></video>



CSS `linear()` demo.

Learn more about [`linear()`](https://developer.chrome.com/articles/css-linear-easing-function/). To create `linear()` curves, use the [linear easing generator](https://linear-easing-generator.netlify.app/).

### [Scroll End](#scroll-end)

Browser Support

*   114
*   114
*   109
*   x

[Source](https://developer.mozilla.org/docs/Web/API/Document/scrollend_event)

Many interfaces include scroll interactions, and sometimes the interface needs to synchronize information relevant to the current scroll position, or fetch data based on current state. Before the `scrollend` event, you had to use an inaccurate timeout method that could fire while the user's finger was still on the screen. With the `scrollend` event, you have a perfectly timed scrollend event that understands whether a user is still mid gesture or not.

[Scrollend Screencast](#scrollend-screencast)[Scrollend Demo](#scrollend-demo)[More](#)

 <video src="" control></video>

This was important for the browser to own because JavaScript cannot track a fingers presence on the screen during a scroll, the information is just simply not available. Chunks of inaccurate scroll end attempting code can now be deleted and replaced with a browser owned high precision event.

Learn more about [scrollend](https://developer.chrome.com/blog/scrollend-a-new-javascript-event/).

### [Scroll-driven animations](#scroll-animations)

Browser Support

*   115
*   115

*   x

[Source](https://developer.mozilla.org/docs/Web/CSS/animation-timeline)

Scroll-driven animations are an exciting feature available from Chrome 115. These allow you to take an existing [CSS animation](https://developer.mozilla.org/docs/Web/CSS/CSS_Animations/Using_CSS_animations) or [an animation built with the Web Animations API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API), and couple it to the scroll offset of a scroller. As you scroll up and down–or left and right in a horizontal scroller–the linked animation will scrub forwards and backwards in direct response.

With a ScrollTimeline you can track the overall progress of a scroller, as demonstrated in the following demo. As you scroll to the end of the page, the text reveals itself character by character.

[SDA Screencast](#sda-screencast)[SDA Demo](#sda-demo)[More](#)

 <video src="" control></video>



CSS scroll-driven animations demo: scroll timeline

With a ViewTimeline you can track an element as it crosses the scrollport. This works similarly to how IntersectionObserver tracks an element. In the following demo, each image reveals itself from the moment it enters the scrollport until it is at the center.

[SDA Demo Screencast](#sda-demo-screencast)[SDA Live Demo](#sda-live-demo)[More](#)

 <video src="" control></video>



CSS scroll-driven animations demo: view timeline

Because scroll-driven animations work with CSS animations and the Web Animations API, you can benefit from all the advantages these APIs bring. That includes the ability to have these animations run off the main thread. You can now have silky smooth animations, driven by scroll, running off the main thread with just a few lines of extra code–what's not to like?

To learn more about scroll-driven animations [check out this article with all the details](https://developer.chrome.com/articles/scroll-driven-animations/) or [visit scroll-driven-animations.style](https://scroll-driven-animations.style/) which includes many demos.

### [Deferred timeline attachment](#deferred)

Browser Support

*   116
*   116
*   x
*   x

[Source](https://developer.mozilla.org/docs/Web/CSS/timeline-scope)

When applying a scroll-driven animation through CSS, the lookup mechanism to find the controlling scroller always walks up the DOM tree making it limited to scroll ancestors only. Very often though, the element that needs to be animated is not a child of the scroller but an element located in an entirely different subtree.

To allow the animated element to find a named scroll-timeline of a non-ancestor use the `timeline-scope` property on a shared parent. This allows the defined `scroll-timeline` or `view-timeline` with that name to attach to it, giving it a broader scope. With this in place, any child of that shared parent can use the timeline with that name.

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/defferedtimeline.png) With `timeline-scope` declared on the shared parent, the `scroll-timeline` declared on the scroller can be found by the element that uses it as its `animation-timeline` [Demo Screencast](#demo-screencast)[Live Demo](#live-demo)[More](#)

 <video src="" control></video>



CSS scroll-driven animations demo: deferred timeline attachment

Learn more about [`timeline-scope`](https://developer.chrome.com/articles/scroll-driven-animations/#attaching-to-a-non-ancestor-scroll-timeline).

### [Discrete property animations](#discrete-animations)

Browser Support

*   117
*   117
*   x
*   x

Another new capability in 2023 is the ability to animate discrete animations, such as animating to and from `display: none`. From Chrome 116, you can use `display` and `content-visibility` in keyframe rules. You can also transition any discrete property at the 50% point rather than at the 0% point. This is achieved with the `transition-behavior` property using the `allow-discrete` keyword, or in the `transition` property as a shorthand.

[Discrete Anim. Screencast](#discrete-anim.-screencast)[Discrete Anim. Demo](#discrete-anim.-demo)[More](#)

 <video src="" control></video>

Learn more about [transitioning discrete animations](https://developer.chrome.com/blog/entry-exit-animations/#transitioning-discrete-animations).

### [@starting-style](#starting-style)

Browser Support

*   117
*   117
*   x
*   x

[Source](https://developer.mozilla.org/docs/Web/CSS/@starting-style)

The `@starting-style` CSS rule builds on new web capabilities for animating to and from `display: none`. This rule provides a way to give an element a "before-open" style that the browser can look up before the element is open on the page. This is very useful for entry animations, and for animating in elements such as a popover or dialog. It can also be useful for any time you are creating an element and want to give it the ability to animate in. Take the following example which animates a `popover` attribute (see next section) into view and into the top layer smoothly from outside of the viewport.

[@starting-style Screencast](#starting-style-screencast)[@starting-style Demo](#starting-style-demo)[More](#)

 <video src="" control></video>

Learn more about [@starting-style](https://developer.chrome.com/blog/entry-exit-animations/#the-starting-style-rule-for-entry-animations) and other entry animations.

### [Overlay](#overlay)

Browser Support

*   117
*   117
*   x
*   x

[Source](https://developer.mozilla.org/docs/Web/CSS/overlay)

The new CSS `overlay` property can be added to your transition to enable elements with top-layer styles—such as `popover` and `dialog`—to animate out of the top-layer smoothly. If you don't transition overlay, your element will immediately go back to being clipped, transformed, and covered up, and you won't see the transition happen. Similarly, `overlay` enables `::backdrop` to animate out smoothly when added to a top-layer element.

[Overlay Screencast](#overlay-screencast)[Overlay Live Demo](#overlay-live-demo)[More](#)

 <video src="" control></video>

Learn more about [overlay](https://developer.chrome.com/blog/entry-exit-animations/#overlay-property) and other exit animations.

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/csswrapped_components.svg)

[Components](#components)
-------------------------

2023 was a big year for the intersection of style and HTML components, with `popover` landing and a lot of work being done around anchor positioning and the future of styling dropdowns. These components make it easier to build common UI patterns without the need to rely on additional libraries or building your own state management systems from the ground up each time.

### [Popover](#popover)

Browser Support

*   114
*   114

*   17

[Source](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetAction)

The Popover API helps you build elements which lay on top of the rest of the page. These could include menus, selection, and tooltips. You can create a simple popover by adding the `popover` attribute and an `id` to the element which pops up, and connecting its `id` attribute to an invoking button using `popovertarget="my-popover"`. The Popover API supports:

*   **Promotion to the top layer.** Popovers will appear on a separate layer above the rest of the page, so you don't have to play around with z-index.
*   **Light-dismiss functionality.** Clicking outside of the popover area will close the popover and return focus.
*   **Default focus management.** Opening the popover makes the next tab stop inside the popover.
*   **Accessible keyboard bindings.** Hitting the `esc` key or double toggling will close the popover and return focus.
*   **Accessible component bindings.** Connecting a popover element to a popover trigger semantically.

[Popover Screencast](#popover-screencast)[Popover Live Demo](#popover-live-demo)[More](#)

 <video src="" control></video>

### [Horizontal rules in select](#hrselect)

Another small change to HTML which landed in Chrome and Safari this year, is the ability to add horizontal rule elements (`<hr>` tags) into `<select>` elements to help visually break up your content. Previously, putting an `<hr>` tag into a select simply would not render. But this year, both Safari and Chrome support this feature, enabling better separation of content within `<select>` elements.

[Select Screenshot](#select-screenshot)[Select Live Demo](#select-live-demo)[More](#)

![](https://developer.chrome.com/static/blog/css-wrapped-2023/image/hrselect.jpg)

Learn more about using [using hr in select](https://developer.chrome.com/blog/hr-in-select/)

### [:user-valid and invalid pseudo classes](#user-states)

Browser Support

*   119
*   119
*   88
*   16.5

[Source](https://developer.mozilla.org/docs/Web/CSS/:user-valid)

Stable in all browsers this year, the `:user-valid` and `:user-invalid` behave similarly to the `:valid` and `:invalid` pseudo-classes, but match a form control only after a user has significantly interacted with the input. A form control that is required and empty will match `:invalid` even if a user has not started interacting with the page. The same control will not match `:user-invalid` until the user has changed the input and left it in an invalid state.

With these new selectors, there's no longer a need to write stateful code to keep track of input a user has changed.

[:user-* Screencast](#:user--screencast)[:user-* Live Demo](#:user--live-demo)[More](#)

 <video src="" control></video>

Learn more about using [user-* form validation pseudo elements](https://web.dev/articles/user-valid-and-user-invalid-pseudo-classes).

### [Exclusive accordion](#named-details)

Browser Support

*   120
*   120
*   x
*   17.2

A common UI pattern on the web is an accordion component. To implement this pattern, you combine a few `<details>` elements, often visually grouping them to indicate that they belong together.

New in Chrome 120 is support for the `name` attribute on `<details>` elements. When this attribute is used, multiple `<details>` elements that have the same `name` value form a semantic group. At most one element in the group can be open at once: when you open one of the `<details>` elements from the group, the previously open one will automatically close. This type of accordion is called an _exclusive accordion_.

Exclusive accordion demo

The `<details>` elements that are part of an exclusive accordion don't necessarily need to be siblings. They can be scattered across the document.

[Conclusion](#conclusion)
-------------------------

CSS has had such a renaissance in the past few years, and especially during 2023. If you're new to CSS or just want a refresher on the basics, check out our free [Learn CSS](https://web.dev/learn/css) course along with the other free courses on offer at web.dev.

We wish you a happy holiday season and hope you get a chance to incorporate some of these brilliant new CSS and UI features into your work soon!

⇾ The Chrome UI DevRel Team,

.wd-authors { --avatar-size: 65px; display: flex; gap: 2em; } .wd-author { display: flex; flex-wrap: wrap; gap: 1em; line-height: calc(var(--avatar-size) / 2); } .wd-author img { border-radius: 50%; height: var(--avatar-size, 65px); width: var(--avatar-size, 65px); } .dcc-authors { --avatar-size: 65px; display: flex; gap: 2em; } .dcc-author { display: flex; flex-wrap: wrap; gap: 1em; line-height: calc(var(--avatar-size) / 2); } .dcc-author img { border-radius: 50%; height: var(--avatar-size, 65px); width: var(--avatar-size, 65px); }

![](https://web.dev/images/authors/unakravets.jpg) Una Kravets [Twitter](https://twitter.com/una) [Mastodon](https://front-end.social/@una) [Homepage](https://una.im) ![](https://web.dev/images/authors/bramus.jpg) Bramus [Twitter](https://twitter.com/bramus) [GitHub](https://github.com/bramus) [Mastodon](https://front-end.social/@bramus) [Homepage](https://www.bram.us/) ![](https://web.dev/images/authors/argyle.jpg) Adam Argyle [Twitter](https://twitter.com/argyleink) [GitHub](https://github.com/argyleink)
