---
title: One Thing Nobody Explained To You About TypeScript - kettanaito.com
date: 2023-10-03 16:14:15
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [kettanaito.com](https://kettanaito.com/blog/one-thing-nobody-explained-to-you-about-typescript)

> One of the most common mistakes in configuring TypeScript.

I've been using [TypeScript](https://www.typescriptlang.org/) for over four years now, and, overall, it's been a great experience. With time, the friction of using it has minimized until it became zero, making me much more productive when writing types or even approaching problems type-first. Although I'm far from being a true type wizard, I dare consider myself proficient with the language, having gone thourgh my share of type gymnastics, conditional types, nested generics, and contemplating the sacred difference between `type` and `interface`. Thruthfully, I thought I understood the language rather well.

Until I didn't. See, there's one particular thing about TypeScript that I got totally wrong, and I believe you did too. And it's not some contrived corner case you've never heard of and likely won't ever use. Quite the opposite. It's something you, and any other TypeScript developer interacted directly hundreds of times, something that's been swimming right under our noses all along.

**I'm talking about `tsconfig.json`.**

And no, this isn't about how complex it can get (I confess I can't explain `target` and `module` without a moment of thought). Instead, it's something rather simple. It's about what `tsconfig.json` _actually does_.

"_Well, it's a configuration file, it configures TypeScript, duh._" Right! It does, but not in a way you would expect. Let me show you.

Libraries, tests, and the truth
-------------------------------

There's a great example behind every great discovery. I will do my best for this to be both.

Let's write a simple frontend application. And I mean it, no frameworks, no dependencies. _Simple_.

```
1

2const greetingText = document.createElement('p')

3greetingText.innerText = 'Hello, John!'

4


5document.body.appendChild(greetingText)

```

Create a paragraph element and greet John. Simple. So far so good.

But where does the `document` come from? You can say it's a global variable in JavaScript and, by all means, you would be right. There's just one thing. We aren't in JavaScript. Not yet, really. We are looking at some TypeScript code in our IDE. It'd have to be compiled to become JavaScript, land in the browser, and for the browser to expose the `document` global to it. So how does TypeScript knows of the `document`, its presence, and its methods?

TypeScript does that by loading a default _definition library_ called `lib.dom`. Think of it as a `.d.ts` file containing a bunch of types to describe JavaScript globals, because that's precisely what it is. You can see that for yourself by holding CMD (CTRL on Windows) and clicking on the `document` object. Mystery solved.

Since our application is, naturally, the best thing since sliced bread, let's add some automated tests for it. For this step, we will betray our notion of simplicity and install a testing framework called Vitest. Next, we write the test itself:

```
1

2it('greets John', async () => {

3  await import('./app')

4  const greetingText = document.querySelector('p')

5  expect(greetingText).toHaveText('Hello, John!')

6})

```

Once we try to run this test, TypeScript would _interfere_ with an error:

```
Cannot find name 'it'. Do you need to install type definitions for a test runner?

```

It hurts me to admit it but the compiler has the point. Where would `it` come from? It's not a global like `document`, it has to come from somewhere. Well, actually, it's quite common for the testing frameworks to extend the global object and expose functions like `it` and `expect` globally so you can access them in each test without having to import them explicitly.

We follow a conveniently present section of our testing framework's documentation and enable global `it` by modifying `tsconfig.json`:

```
1

2{

3  "compilerOptions": {

4    "types": ["vitest/globals"]

5  },

6  "include": ["src"]

7}

```

By using the `compilerOptions.types`, we are asking TypeScript to _load additional types_, in this case from `vitest/globals`, that declare the global `it` function. The compiler grins at our efforts and lets the test pass, making us feel particuarly good about ourselves and this whole strictly typed languages ordeal.

But not. So. Fast.

The issue
---------

We will take a slight step to the side but I promise it will all make sense in the end.

Let me ask you this: What happens if you reference a non-existing code in TypeScript? Yep, a wavy red line and the `Cannot find name` type error, that's what happens. We've just seen it a moment ago trying to call `it()` in a test.

Jump back to the `app.ts` module and add a reference to a non-existing global variable called `test`:

```
1

2

3


4test

```

We haven't defined `test`. It's not a browser global, and it certainly doesn't exist in any of TypeScript default libraries. It's a mistake, a bug, it has to go red.

Only, it doesn't. As the red wavy line doesn't reveal itself beneath the code, power courses through you. ~_Authority_~. _Confusion_. To make things worse, not only does TypeScript not produce an error here, it actually tries being helpful, suggesting us to _type_ `test`, showing us its call signature, saying it comes from some `TestApi` namespace. But that's a type from Vitest, how can this be. . .

Would this code compile? Sure. Would it work in the browser? Nope. It will throw like a seasoned pitcher on his brightest day. How come? Isn't the entire purpose of using TypeScript to guard against mistakes like this?

The `test` here is what I refer to as a _ghostly definition_. It's a valid type definition that describes something that just doesn't exist. _Yet another TypeScript shenanigan,_ say you. _Don't hurry blaming the tool,_ say I. Here's what's happening.

(More than) one config to rule them all
---------------------------------------

Move the `app.test.ts` test module from the `src` directory to a newly created `test` directory. Open it. Wait, is that a type error on `it` again? Didn't we fixed that already by adding `vitest/globals` to our `tsconfig.json`?

The thing is, TypeScript doesn't know what to do with the `test` directory. In fact, TypeScript doesn't even know it exists since all we point to in `tsconfig.json` is `src`:

```
1

2{

3  "compilerOptions": {

4    "types": ["vitest/globals"]

5  },

6  "include": ["src"]

7}

```

As I mentioned before, the way TypeScript configuration works is not entirely obvious (at least to me). For a long time I used to think that the `include` option stands for which modules to include in the compilation, and `exclude`, respectively, controls which modules to _exclude_. If we consult [TypeScript documentation](https://www.typescriptlang.org/tsconfig#include) on the matter, we will read this:

> `include`, specifies an array of filenames or patterns to include in the program.

The way I come to understand what `include` does is slightly different and more specific than what's stated in the docs.

The `include` option controls what modules to apply this TypeScript configuration to.

You read it right. If a TypeScript module is located outside of the directories listed in the `include` option, that `tsconfig.json` _will have no effect on that module at all_. Respectively, the `exclude` option allows to filter out which file patterns must be _not_ be affected by the current configuration.

Okay, so we add `test` to `include` and move on with our day, what's the big deal?

```
1

2{

3  "compilerOptions": {

4    "types": ["vitest/globals"]

5  },

6  "include": ["src", "test"]

7}

```

**This is where most developers get it completely wrong**. By adding new directories to `include`, you are expanding this configuration to affect _all of them_. While this change fixes the testing framework types in `test`, it will leak them to all `src` modules! You've just made your entire source code one haunted mansion, unleashing hundreds of ghostly types upon it. Things that don't exist will be typed, thing that are typed may clash with other definitions, and the overall experience with using TypeScript will degrade drastically, especially as your application grows over time.

So, what's the solution then? Should we go and create a bunch of `tsconfig.json` for every directory?

Well, actually, yeah, you should. Except, not for _every_ directory, but for every _environment_ your code is meant to run.

Runtimes and concerns
---------------------

Behind-the-scenes of a modern web application is an exquisite salad of modules. The immediate source of your app is meant to be compiled, minified, code-split, bundled, and shipped to your users. Then there are test files, which are TypeScript modules also, never to be compiled or shipped to anyone. There may also be Storybook stories, Playwright tests, maybe a custom `*.ts` script or two to automate things—all helpful, all having _different intentions_ and meant to run in _different environments_.

But what we write our modules _for_ matters. It matters for TypeScript too. Why do you think it gives you the `Document` type by default? Because it knows you're likely developing a web app. Developing a Node.js server instead? Be so kind to state that intention and install `@types/node`. The compiler cannot guess for you, you need to _tell it what you want_.

And you communicate that intention through `tsconfig.json`. But not just the root-level one. TypeScript can handle nested configurations remarkably well. Because it was _designed to do that_. All you have to do is be explicit about your intentions.

You do so by strategically placing the `tsconfig.json` files across your project. Here's an example:

```
1

2

3

4

5- tsconfig.json

6


7

8

9- tsconfig.build.json

10


11- /e2e

12  

13  

14  

15  

16  - tsconfig.json

17  - Login.test.ts

18


19- /src

20  

21  

22  

23  

24  - App.tsx

25  - util.ts

26


27- /test

28  

29  

30  

31  - tsconfig.json

32  - App.test.tsx

```

Woah, that's a lot of configs! Well, that's a lot of intentions as well: from the source files to various testing levels to the production build. All meant to be type-safe. And you make them type-safe by introducing directory-scoped configurations that extend the base `./tsconfig.json` at the root.

For example, this is what the TypeScript configuration for the `src` files may look like:

```
1

2{

3  

4  "extends": "./tsconfig.json",

5  "compilerOptions": {

6    

7    "target": "es2015",

8    "module": "esnext",

9    

10    "jsx": "react"

11  },

12  

13  "include": ["src"],

14  "exclude": ["node_modules"]

15}

```

In contrast, here's a configuration for the integration tests in the `test` directory:

```
1

2{

3  "extends": "../tsconfig.json",

4  "compilerOptions": {

5    

6    "target": "esnext",

7    "module": "esnext",

8    

9    

10    "types": ["@types/node", "vitest/globals"]

11  },

12  

13  "include": ["**/*.test.ts"]

14}

```

When writing TypeScript configurations, remember this:

You should have as many TypeScript configurations as there are layers in your project: source code, Node.js testing, in-browser testing, third-party tooling, etc.

TypeScript will automatically pick up the `tsconfig.json` closest to the module it type-checks, giving you the ability to extend while deviating where necessary.

The practical aspect
--------------------

For better or worse, we are moving towards the era where developer tooling is abstracted from us. It's fair to expect your framework of choice to handle this configuration jungle for you. In fact, some frameworks already do this. Take [Vite](https://github.com/vitejs/vite/tree/1c031723a821d654e9aed44e43a0a5fa47c240da/packages/create-vite/template-react-ts) as an example. I'm quite confident you can find a multi-configuration setup for TypeScript in about any other project.

But I want you to understand that TypeScript is still your tool, abstracted or not, and you would do good by learning more about it, understanding it better, and using it right.