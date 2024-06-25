> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [jser.dev](https://jser.dev/2024-05-11-introducing-rie/)

> React Internals Explorer is a visualization tool to help you understand React internals easily.

Introducing DDIR Companion App

![](https://jser.dev/static/og_rie_1x.jpg)[](https://jser.pro/ddir/rie)

Why I built it?
---------------

When I first tried to dive deeper into React in 2021, I drew myself [a few diagrams](https://github.com/JSerZANP/react-source-code-walkthrough-en/blob/main/memo/) to help myself understand React internals, below is one of them.

![](https://jser.dev/static/react2.png)

Obviously it is a lot of manual effort and also it is just a static image, what if we can visualize React internals automatically and make it dynamic? I had this idea of visualization tool in my mind for a long time, and finally I made it happen.

How to use it?
--------------

The UI of [RIE(React Internals Explorer)](https://jser.pro/ddir/rie) should be straightforward, basically you can

1.  Choose React version (currently supporting 18.3.1 and 19-rc)
2.  Edit your code or choose the built-in snippet
3.  Click the “Run” button to inspect the React internals
4.  Interact with the preview and see the the internal updates.

![](https://jser.dev/static/rie-intro.png)

For example you can choose “Suspense - multi throw” snippet and see how React@19 and React@18 handle things differently

Maybe it is easier to watch my quick intro video. 😳

Next steps.
-----------

[RIE(React Internals Explorer)](https://jser.pro/ddir/rie) is still in early stage, as companion app for [DDIR(Deeper Dive Into React)](https://jser.pro/ddir), I’ll try to cover more flows and make it easier to use.

If you have better idea or bug reports, please drop me a message.

[![](https://jser.dev/static/series-react-source-code-walkthrough-1x.jpg)

Want to know more about how React works internally?  
Check out my series - **React Internals Deep Dive**!

](https://jser.dev/series/react-source-code-walkthrough)