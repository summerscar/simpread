> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-tap-highlight-color)

**Non-standard:** This feature is non-standard and is not on a standards track. Do not use it on production sites facing the Web: it will not work for every user. There may also be large incompatibilities between implementations and the behavior may change in the future.

**`-webkit-tap-highlight-color`** is a non-standard CSS property that sets the color of the highlight that appears over a link while it's being tapped. The highlighting indicates to the user that their tap is being successfully recognized, and indicates which element they're tapping on.

```
-webkit-tap-highlight-color: red;
-webkit-tap-highlight-color: transparent; /* for removing the highlight */

/* Global values */
-webkit-tap-highlight-color: inherit;
-webkit-tap-highlight-color: initial;
-webkit-tap-highlight-color: revert;
-webkit-tap-highlight-color: revert-layer;
-webkit-tap-highlight-color: unset;


```

[Syntax](#syntax)
-----------------

### [Values](#values)

A [`<color>`](/en-US/docs/Web/CSS/color_value).

[Formal definition](#formal_definition)
---------------------------------------

<table><tbody><tr><th scope="row"><a href="/en-US/docs/Web/CSS/initial_value">Initial value</a></th><td><code>black</code></td></tr><tr><th scope="row">Applies to</th><td>all elements</td></tr><tr><th scope="row"><a href="/en-US/docs/Web/CSS/Inheritance">Inherited</a></th><td>yes</td></tr><tr><th scope="row"><a href="/en-US/docs/Web/CSS/computed_value">Computed value</a></th><td>as specified</td></tr><tr><th scope="row">Animation type</th><td>discrete</td></tr></tbody></table>

[Formal syntax](#formal_syntax)
-------------------------------

```
-webkit-tap-highlight-color =
  <color>


```

[Specifications](#specifications)
---------------------------------

Not part of any standard. Apple has [a description in the Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html#//apple_ref/doc/uid/TP40006510-SW5).

[Browser compatibility](#browser_compatibility)
-----------------------------------------------

[Report problems with this compatibility data on GitHub](https://github.com/mdn/browser-compat-data/issues/new?mdn-url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2F-webkit-tap-highlight-color&metadata=%3C%21--+Do+not+make+changes+below+this+line+--%3E%0A%3Cdetails%3E%0A%3Csummary%3EMDN+page+report+details%3C%2Fsummary%3E%0A%0A*+Query%3A+%60css.properties.-webkit-tap-highlight-color%60%0A*+Report+started%3A+2023-07-04T08%3A47%3A13.202Z%0A%0A%3C%2Fdetails%3E&title=css.properties.-webkit-tap-highlight-color+-+%3CSUMMARIZE+THE+PROBLEM%3E&template=data-problem.yml "Report an issue with this compatibility data")<table><thead><tr><td></td><th colspan="5" title="desktop">desktop</th><th colspan="6" title="mobile">mobile</th></tr><tr><td></td><th>Chrome</th><th>Edge</th><th>Firefox</th><th>Opera</th><th>Safari</th><th>Chrome Android</th><th>Firefox for Android</th><th>Opera Android</th><th>Safari on iOS</th><th>Samsung Internet</th><th>WebView Android</th></tr></thead><tbody><tr><th scope="row"><code>-webkit-tap-highlight-color</code><abbr title="Non-standard. Expect poor cross-browser support.">Non-standard</abbr></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome16Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge12Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>FirefoxNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera15Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>SafariNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android18Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>Firefox for AndroidNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS4Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet1.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android37Toggle history</button></td></tr></tbody></table>

### Legend

Tip: you can click/tap on a cell for more information.

Full support

Full support

No support

No support

Non-standard. Check cross-browser support before using.

The compatibility table on this page is generated from structured data. If you'd like to contribute to the data, please check out [https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data) and send us a pull request.

[See also](#see_also)
---------------------

*   [WebKit CSS extensions](/en-US/docs/Web/CSS/WebKit_Extensions)
*   Related CSS pseudo-classes:
    *   [`:hover`](/en-US/docs/Web/CSS/:hover)
    *   [`:active`](/en-US/docs/Web/CSS/:active)
    *   [`:visited`](/en-US/docs/Web/CSS/:visited)