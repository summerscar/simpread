> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [bun.sh](https://bun.sh/blog/bun-macros)

> Call JavaScript functions at bundle-time and inline results into the AST

Two weeks ago, we launched our new JavaScript [bundler](https://bun.sh/blog/bun-bundler) in Bun [v0.6.0](https://bun.sh/blog/bun-v0.6.0). Today we're releasing a new feature that highlights the tight integration between Bun's bundler and runtime: Bun Macros.

Macros are a mechanism for running JavaScript functions _at bundle-time_. The value returned from these functions are directly inlined into your bundle.

As a toy example, consider this simple function that returns a random number.

```
export function random() {
  return Math.random();
}


```

Inside our source code, we can import this function as a macro using [_import attribute_](https://github.com/tc39/proposal-import-attributes) syntax. If you haven't seen this syntax before, it's a Stage 3 TC39 proposal that lets you attach additional metadata to `import` statements.

cli.tsx

```
import { random } from './random.ts' with { type: 'macro' };

console.log(`Your random number is ${random()}`);


```

Now we'll bundle this file with `bun build`. The bundled file will be printed to stdout.

```
console.log(`Your random number is ${0.6805550949689833}`);

```

As you can see, the source code of the `random` function occurs nowhere in the bundle. Instead, it is executed _during bundling_ and the function call (`random()`) is replaced with the result of the function. Since the source code will never be included in the bundle, macros can safely perform privileged operations like reading from a database.

[When to use macros](#when-to-use-macros)
-----------------------------------------

For small things where you would otherwise have a one-off build script, bundle-time code execution can be easier to maintain. It lives with the rest of your code, it runs with the rest of the build, it is automatically paralellized, and if it fails, the build fails too.

If you find yourself running a lot of code at bundle-time though, consider running a server instead.

Let's look at some scenarios where macros might be useful.

### [Embed latest git commit hash](#embed-latest-git-commit-hash)

in-the-browser.ts

```
import { getGitCommitHash } from './getGitCommitHash.ts' with { type: 'macro' };

console.log(`The current Git commit hash is ${getGitCommitHash()}`);


```

getGitCommitHash.ts

```
export function getGitCommitHash() {
  const {stdout} = Bun.spawnSync({
    cmd: ["git", "rev-parse", "HEAD"],
    stdout: "pipe",
  });

  return stdout.toString();
}


```

When we build it, the `getGitCommitHash` is replaced with the result of calling the function:

output.js

```
console.log(`The current Git commit hash is 3ee3259104f`);


```

CLI

```
bun build --target=browser ./in-the-browser.ts

```

You're probably thinking"Why not just use `process.env.GIT_COMMIT_HASH`?" Well, you can do that too. But can you do this with an environment variable?

### [Make `fetch()` requests at bundle-time](#make-fetch-requests-at-bundle-time)

In this example, we make an outgoing HTTP request using `fetch()`, parse the HTML response using `HTMLRewriter`, and return an object containing the title and meta tags–all at bundle-time.

in-the-browser.tsx

```
import { extractMetaTags } from './meta.ts' with { type: 'macro' };

export const Head = () => {
  const headTags = extractMetaTags("https://example.com");

  if (headTags.title !== "Example Domain") {
    throw new Error("Expected title to be 'Example Domain'");
  }

  return <head>
    <title>{headTags.title}</title>
    <meta  content={headTags.viewport} />
  </head>;
};


```

meta.ts

```
export async function extractMetaTags(url: string) {
  const response = await fetch(url);
  const meta = {
    title: "",
  };
  new HTMLRewriter()
    .on("title", {
      text(element) {
        meta.title += element.text;
      },
    })
    .on("meta", {
      element(element) {
        const name =
          element.getAttribute("name") ||
          element.getAttribute("property") ||
          element.getAttribute("itemprop");

        if (name) meta[name] = element.getAttribute("content");
      },
    })
    .transform(response);

  return meta;
}


```

The `extractMetaTags` function is erased at bundle-time and replaced with the result of the function call. This means that the `fetch` request happens at bundle-time, and the result is embedded in the bundle. Also, the branch throwing the error is eliminated since it's unreachable.

output.js

```
import { jsx, jsxs } from "react/jsx-runtime";
export const Head = () => {
  jsxs("head", {
    children: [
      jsx("title", {
        children: "Example Domain",
      }),
      jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
    ],
  });
};

export { Head };


```

CLI

```
bun build --target=browser --minify-syntax ./in-the-browser.ts

```

[How it works](#how-it-works)
-----------------------------

Bun Macros are import statements annotated the `{type: 'macro'}` [import attribute](https://github.com/tc39/proposal-import-attributes).

```
import { myMacro } from './macro.ts' with { type: 'macro' }


```

Import attributes are a Stage 3 ECMAScript proposal, which means it is overwhelmingly likely they will be added as an official part of the JavaScript language.

Bun also supports _import assertion_ syntax. Import assertions were an earlier incarnation of import attributes that has now been abandoned (but is [already supported](https://caniuse.com/mdn-javascript_statements_import_import_assertions) by a number of browsers and runtimes).

```
import { myMacro } from "./macro.ts" assert { type: "macro" };


```

When Bun's transpiler sees one of these special imports, it calls the function inside the transpiler using Bun's JavaScript runtime and converts the return value from JavaScript into an AST node. These JavaScript functions are called at bundle-time, not runtime.

### [Execution order](#execution-order)

Bun Macros are executed synchronously in the transpiler during the visiting phase—before plugins and before the transpiler generates the AST. They are executed in the order they are called. The transpiler will wait for the macro to finish executing before continuing. The transpiler will also `await` any `Promise` returned by a macro.

Bun's bundler is multi-threaded. As such, macros execute in parallel inside of multiple spawned JavaScript"workers".

### [Dead code elimination](#dead-code-elimination)

The bundler performs dead code elimination _after_ running and inlining macros. So given the following macro:

returnFalse.ts

```
export function returnFalse() {
  return false;
}


```

...then bundling the following file will produce an empty bundle.

```
import {returnFalse} from './returnFalse.ts' with { type: 'macro' };

if (returnFalse()) {
  console.log("This code is eliminated");
}



```

[Security considerations](#security-considerations)
---------------------------------------------------

Macros must explicitly be imported with `{ type: "macro" }` in order to be executed at bundle-time. These imports have no effect if they are not called, unlike regular JavaScript imports which may have side effects.

You can disable macros entirely by passing the `--no-macros` flag to Bun. It produces a build error like this:

```
error: Macros are disabled

foo();
^
./hello.js:3:1 53


```

### [_Macros are disabled in node_modules_](#macros-are-disabled-in-node-modules)

To reduce the potential attack surface for malicious packages, macros cannot be _invoked_ from inside `node_modules/**/*`. If a package attempts to invoke a macro, you'll see an error like this:

```
error: For security reasons, macros cannot be run from node_modules.

beEvil();
^
node_modules/evil/index.js:3:1 50


```

Your application code can still import macros from `node_modules` and invoke them.

```
import {macro} from "some-package" with { type: "macro" };

macro();


```

[Limitations](#limitations)
---------------------------

Some things to know.

### [_The result of the macro must be serializable!_](#the-result-of-the-macro-must-be-serializable)

Bun's transpiler needs to be able to serialize the result of the macro so it can be inlined into the AST. All JSON-compatible data structures are supported:

macro.ts

```
export function getObject() {
  return {
    foo: "bar",
    baz: 123,
    array: [ 1, 2, { nested: "value" }],
  };
}


```

Macros can be async, or return `Promise` instances. Bun's transpiler will automatically `await` the `Promise` and inline the result.

macro.ts

```
export async function getText() {
  return "async value";
}


```

The transpiler implements specicial logic for serializing common data formats like `Response`, `Blob`, `TypedArray`.

*   `TypedArray`: Resolves to a base64-encoded string.
*   `Response`: Where relevant, Bun will read the `Content-Type` and serialize accordingly; for instance, a `Response` with type `application/json` will be automatically parsed into an object and `text/plain` will be inlined as a string. Responses with an unknown or undefined `type` will be base-64 encoded.
*   `Blob`: As with `Response`, the serialization depends on the `type` property.

The result of `fetch` is `Promise<Response>`, so it can be directly returned.

macro.ts

```
export function getObject() {
  return fetch("https://bun.sh")
}


```

Functions and instances of most classes (except those mentioned above) are not serializable.

```
export function getText(url: string) {
  // this doesn't work!
  return () => {};
}


```

### [_The input arguments must be statically analyzable._](#the-input-arguments-must-be-statically-analyzable)

Macros can accept inputs, but only in limited cases. The value must be statically known. For example, the following is not allowed:

```
import {getText} from './getText.ts' with { type: 'macro' };

export function howLong() {
  // the value of `foo` cannot be statically known
  const foo = Math.random() ? "foo" : "bar";

  const text = getText(`https://example.com/${foo}`);
  console.log("The page is ", text.length, " characters long");
}


```

However, if the value of `foo` is known at bundle-time (say, if it's a constant or the result of another macro) then it's allowed:

```
import {getText} from './getText.ts' with { type: 'macro' };
import {getFoo} from './getFoo.ts' with { type: 'macro' };

export function howLong() {
  // this works because getFoo() is statically known
  const foo = getFoo();
  const text = getText(`https://example.com/${foo}`);
  console.log("The page is", text.length, "characters long");
}


```

This outputs:

```
function howLong() {
  console.log("The page is", 1322, "characters long");
}
export { howLong };


```