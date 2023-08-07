---
title: overscroll-behavior がお手軽！ モーダル UI 等のスクロール連鎖を防ぐ待望の CSS - ICS MEDIA
date: 2023-07-11 13:51:27
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [ics.media](https://ics.media/entry/221024/)

> 2022 年 9 月に Safari16 がリリースされ、すべての主要なブラウザで、CSS の overscroll-behavior プロパティが利用可能になりました。

2022 年 10 月 27 日 公開 / [株式会社 ICS 古舘 和志](https://ics.media/entry/staff/furudate/)

2022 年 9 月に Safari 16 がリリースされ、すべての主要なブラウザで、CSS の`overscroll-behavior`プロパティが利用可能になりました。Chrome や Firefox では、2018 年 3 月からサポートされていたプロパティだったので、耳にしたことがある方も多いのではないでしょうか？

`overscroll-behavior`プロパティは、スクロール可能なコンテンツ（以下、スクロールコンテナー）を端までスクロールした時の動作を制御できるプロパティです。このプロパティを利用することで次のような問題を解決できます。

*   背面のコンテンツにスクロールが伝達する動作を抑制する
*   ダイアログやハンバーガーメニューといった、画面固定したコンテンツをスクロールする場合も、背面がスクロールされる問題を防ぐ
*   ブラウザの Pull-to-Refresh（ブラウザを上方向にスワイプしてリロードする）を抑制する

画面固定したコンテンツで背面がスクロールされる問題は、[『HTML でモーダル UI を作るときに気をつけたいこと』](https://ics.media/entry/220620/)でも取り上げていて、JavaScript で制御する対策を紹介しました。同じ問題を`overscroll-behavior`プロパティでよりシンプルに解決できるようになります。

本記事では、`overscroll-behavior`プロパティで制御できる動作と使い方について紹介します。

### overscroll-behavior とは

`overscroll-behavior`は、スクロールコンテナーを境界（端）までスクロールしたあと、さらに同じ方向にスクロールした時の動作を制御するプロパティです。

動作は大きく 2 つに分類されます。ひとつは背面にスクロールコンテナーがあれば、背面にスクロールが伝達するスクロールチェーンと呼ばれる動作です。もうひとつは Pull-to-Refresh（ブラウザを上方向にスワイプしてリロードする）といった、オーバースクロール（スクロール可能な領域を少し超えて行われること）の動作です。

▼背面のコンテンツにスクロールが伝達される例 ![](https://ics.media/entry/221024/images/scroll-chain.gif)

▼Pull-to-Refresh の例 ![](https://ics.media/entry/221024/images/pull-to-refresh.gif)

#### スクロール可能なコンテンツでプロパティを利用できる

`overflow`プロパティのように x 軸、y 軸をそれぞれ制御する`overscroll-behavior-x`と`overscroll-behavior-y`というプロパティが存在し、2 つの軸を制御する`overscroll-behavior`プロパティがあります。

`overflow: auto`および`overflow: scroll`が指定されたスクロールコンテナーに対して`overscroll-behavior`プロパティを指定することで適用されます。

`overflow`プロパティが設定されていた場合でも、スクロールバーが発生しない**スクロール不可能な要素**だった場合は、`overscroll-behavior`プロパティは無視されます。

▼`overscroll-behavior`が適用される例

```
<div>
  <div></div>
</div>


```

```
.container {
  width: 100px;
  height: 25px;
  overflow-y: auto;
  overscroll-behavior-y: none;
}
.item {
  width: 100%;
  height: 50px;
}


```

▼スクロール不可能なため、`overscroll-behavior`が無視される例

```
<div>
  <div></div>
</div>


```

```
.largeContainer {
  width: 100px;
  height: 100px;
  overflow-y: auto;
  overscroll-behavior-y: none;
}
.item {
  width: 100%;
  height: 50px;
}


```

#### 値の初期値には`auto`が指定され、`contain`または`none`で制御する

`overscroll-behavior`の値は、`auto | contain | none` の 3 つが存在します。初期値には`auto`が指定されます。

<table><thead><tr><th>値</th><th>説明</th></tr></thead><tbody><tr><td>auto</td><td>スクロールチェーンやオーバースクロールは、デフォルトの動作を行います。</td></tr><tr><td>contain</td><td>スクロールチェーンを抑制し、オーバースクロールの動作を維持します。</td></tr><tr><td>none</td><td>スクロールチェーンと、オーバースクロールの動作を抑制します。</td></tr></tbody></table>

3 つ値の具体的な動作は、次のサンプルで確認できます。`overscroll-behavior`プロパティが`contain`または`none`だった場合、背面のコンテンツにスクロールが伝達しないことを確認できます。

加えて`contain`は、オーバースクロールの動作を維持します。このサンプルでは、コンテンツを超えて上下にバウンスする効果を確認できます。（次の GIF 画像の 2 番目）

効果が有効かどうかは、OS やブラウザによって異なりますが、モバイルの Pull-to-Refresh が有効なブラウザから確認できると思います。

![](https://ics.media/entry/221024/images/demo01.gif)

*   [サンプルを別ウインドウで開く](https://ics-creative.github.io/221007_overscroll-behavior/demo01/)
*   コードを確認する（[HTML](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/demo01/index.html)、[CSS](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/styles)）

どのような使い方ができるのか、作例をいくつか用意しましたのでご紹介します。実装の参考にしてみてください。

#### 画面固定で表示する UI の作例

画面固定で表示されるダイアログとハンバーガーメニューを`dialog`要素で実装し、`overscroll-behavior: contain`で制御した作例です。

表示されるコンテンツを画面サイズにして、背景を含めたスクロール制御をしています。また、表示されるコンテンツをスクロール可能なサイズにしなければ`overscroll-behavior`プロパティは適用されないため、縦幅を`height: calc(100% + 1px);`として 1px だけスクロールできるように調整しています。

![](https://ics.media/entry/221024/images/demo02.gif)

*   [サンプルを別ウインドウで開く](https://ics-creative.github.io/221007_overscroll-behavior/demo02/)
*   コードを確認する（[HTML](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/demo02/index.html)、[CSS](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/styles)）

ハンバーガーメニューを`dialog`要素で実装しているのは、少し変わったアプローチかもしれませんが、キーボード操作を考慮するために使用しています。詳しく知りたい方は、次の記事も参考にしてみてください。

*   [『HTML でモーダル UI を作るときに気をつけたいこと』](https://ics.media/entry/220620/)

#### ルート要素を制御する作例

ルートとなる要素に`overscroll-behavior`プロパティを指定することも可能です。次の作例では、`overscroll-behavior-y: none`を指定しています。ブラウザの Pull-to-Refresh が確認できるデバイスで見ると、Pull-to-Refresh が抑制されていることを確認できます。

![](https://ics.media/entry/221024/images/demo03.gif)

*   [サンプルを別ウインドウで開く](https://ics-creative.github.io/221007_overscroll-behavior/demo03/)
*   [コードを確認する](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/demo03/index.html)

ブラウザごとに`overscroll-behavior`プロパティを指定するルートの要素が異なります。Chrome や Edge など Chromium 系のブラウザでは、`body`要素を指定して、Safari や Firefox では`html`要素に指定することで動作します。

```
html,
body {
  overscroll-behavior-y: none;
}


```

#### iframe 要素は、ブラウザによって異なる動作をするので注意

最後に、`iframe`要素に`overscroll-behavior: none`を設定した作例を紹介します。この作例は Chrome や Edge など Chromium 系のブラウザでのみ動作します。

[MDN のドキュメント](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior#try_it)では、`iframe`要素はスクロールコンテナーではないため、`overscroll-behavior`プロパティでスクロールを制御できないという説明があります。実際に Safari や Firefox では動作せず、ブラウザによって異なる動作をするため注意が必要です。

*   [サンプルを別ウインドウで開く](https://ics-creative.github.io/221007_overscroll-behavior/demo04/)
*   コードを確認する（[HTML](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/demo04/index.html)、[CSS](https://github.com/ics-creative/221007_overscroll-behavior/tree/main/src/styles)）

### ブラウザのサポート状況

[Can I use…](https://caniuse.com/css-overscroll-behavior) によると、Chrome、Firefox、Safari、Edge の最新バージョンで利用可能と記載されています。

![](https://ics.media/entry/221024/images/browser.png)

▲Chrome 65（2018 年 3 月）以上、Edge 79（2020 年 1 月）以上、Safari 16.0（2022 年 9 月）以上、Firefox 59（2018 年 3 月）以上でサポートされています。

### まとめ

`overscroll-behavior`プロパティで制御できる動作や使い方の紹介をしました。とくにスクロールチェーンの制御は、これまでは`body`要素に`overflow: hidden`を追加したり、JavaScript で制御するなど一工夫が必要でした。ですが、`overscroll-behavior`プロパティを利用することでシンプルに制御できるようになります。

実務でも画面固定の UI は実装する機会が多いので、`overscroll-behavior`プロパティが役立つでしょう。

### 参考サイト

*   [MDN - overscroll-behavior CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
*   [W3C - CSS Overscroll Behavior Module Level 1#4. Overscroll Behavior Properties](https://w3c.github.io/csswg-drafts/css-overscroll/#overscroll-behavior-properties)
*   [Take control of your scroll - customizing pull-to-refresh and overflow effects](https://developer.chrome.com/blog/overscroll-behavior/)
