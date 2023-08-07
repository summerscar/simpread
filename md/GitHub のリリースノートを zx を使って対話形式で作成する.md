---
title: GitHub のリリースノートを zx を使って対話形式で作成する
date: 2023-07-04 13:51:27
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zenn.dev](https://zenn.dev/gingertoffee/articles/c3c86f64c49bc5)

[](#zx-%E3%81%8C%E5%A5%BD%E3%81%8D)zx が好き
=========================================

[https://github.com/google/zx](https://github.com/google/zx)

業務では主に PHP と TypeScript を書くことが多い自分にとって、たまに必要にかられて書くシェルスクリプトが、正直あまり好きではないんです…頭のコンテキストの切り替えが大変だし、すぐにググる自身の使いこなせていない感がいつまで経っても抜けないのも辛いです😥

そんなときに出会った `zx` には大変惚れ込みまして、JavaScript で対話形式な CLI ツールがとても簡単に作れるのが魅力で、ちょっとしたものは全て `zx` で書くようになりました。

[](#gh-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%83%8E%E3%83%BC%E3%83%88%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)gh を使ってリリースノートを作成する
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

[https://github.com/cli/cli](https://github.com/cli/cli)

自分が所属しているチームは 10 人程度で、複数の WEB サービスを社内向けに運用しています。
チームにはリリースノートを作成する文化がありませんでした。「さて、これからは作成しましょう！」としたとして、コミットメッセージルールもチームとして持っていなかったので、各人が自由にコミットメッセージを書いている中で「新たにメッセージやラベルルールをこれから決めてみんなで徹底しよう！」というのは難しいなと感じました…（メッセージやラベルルールを決めて、リリースノートを作成する機能・ツールがよくありますよね）

ですので、とりあえず　Pull Request　のタイトルと実装者だけでも記載したリリースノートを作成するようにしよう、と作成したのが以下のスクリプトです。

事前準備として、`zx` と `gh` をインストールします

```
npm i zx gh
```

![](https://zenn.dev/images/copy-icon.svg)

`gh` を利用できるように以下を叩いて、`gh` の初期設定を行います

```
gh auth login
```

![](https://zenn.dev/images/copy-icon.svg)

close した　Pull Request　のリストを一時ファイルに書き出すので、リリースノートに書き出すものだけを残して保存し、その一時ファイル食わせる形でリースノートが作成されます。`.git/` ディレクトリと同じ階層にファイルを置いて実行します。対話式に引数の値を確認しながら進んでいきます。

```
#!/usr/bin/env zx
const GITHUB_URL = ''; // GH, GHE の URL を入力してください
const OWNER_NAME = ''; // リポジトリオーナーを入力してください
const GITHUB_TOKEN = ''; // gh 用に作成したトークンを入力してください

// 指定したリポジトリの PR を「title (#number)」で一覧を書き出す
const fetchPullRequests = async(repoName) => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${GITHUB_TOKEN}`
  };
  const response = await fetch(`${GITHUB_URL}api/v3/repos/${OWNER_NAME}/${repoName}/pulls?state=closed&sort=updated&direction=desc`, {headers});
  const data = await response.json();

  for(let x of data) {
    $`echo ${x.title} '(#${x.number})' by @${x.user.login} >> release_note.md`;
  }
};

// gh release コマンドを実行する
const createReleaseNote = (version) => {
  console.log('新規で tag を切り、リリースノートを作成します…');
  return $`gh release create ${version} -t ${version} -F release_note.md`
};

// リリースノートを作成するための一時ファイルを作成する
const generateReleaseNoteTempFile = () => {
  console.log('リリースノート用の一時ファイルを作成します…');
  return $`vim release_note.md`
};

// リリースノートを削除する
const deleteReleaseNoteTempFile = () => {
  console.log('一時ファイルを削除します…');
  return $`rm release_note.md`
}

// 対話形式で実行する
try {
  const repository = await question('リリースを作成するリポジトリ名は? (ex: koebon)：');
  console.log(''); // 質問の間に空行を挟んで読みやすくする
  await fetchPullRequests(repository);
  await generateReleaseNoteTempFile();
  console.log('');
  const version = await question('作成するリリースバージョンはいくつですか? (ex: v1.10.0)：');
  await createReleaseNote(version);
} finally {
  await deleteReleaseNoteTempFile();
}
console.log('');
console.log('リリースノートが作成されました。お疲れさまでした！');
```

![](https://zenn.dev/images/copy-icon.svg)

こういうほんとちょっとしたものを、サクッと作るのに最高な開発体験なんですよね🦥
よき `zx` ライフを！
