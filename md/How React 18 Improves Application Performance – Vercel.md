> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [vercel.com](https://vercel.com/blog/how-react-18-improves-application-performance)

React 18 has introduced concurrent features that fundamentally change the way React applications can be rendered. We'll explore how these latest features impact and improve your application's performance.

First, let's take a small step back to understand the basics of long tasks and the corresponding performance measurements.

* * *

### [Main thread and Long Tasks](#main-thread-and-long-tasks)

When we run JavaScript in the browser, the JavaScript engine executes code in a single-threaded environment, which is often referred to as the main thread. Along with executing JavaScript code, the main thread is responsible for handling other tasks as well, including managing user interactions like clicks and keystrokes, processing network events, timers, updating animations, and managing browser reflows and repaints.

![The main thread is responsible for handling tasks one by one](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1RSMTPisKrQHANGC0jvRum%2F228367e533f5abf619f537eec2fd59c8%2FGroup_513847.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The main thread is responsible for handling tasks one by one![The main thread is responsible for handling tasks one by one](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7DEO7rotIZKobKgM8noTZ2%2Ff804408b24bf4bd066efae20c7c99606%2FGroup_513709.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The main thread is responsible for handling tasks one by one

When a task is being processed, all other tasks must wait. While small tasks can be executed smoothly by browsers to provide a seamless user experience, longer tasks can be problematic as they can block other tasks from being processed.

Any task that takes more than 50 milliseconds to run is considered a "[long task](https://web.dev/long-tasks-devtools/#what-are-long-tasks)".

![Group 513849.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6NLEvRgyGSh37k774Fbvmj%2F0d0a01de52a773520409865756eb20b4%2FGroup_513849.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513718.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2FsWbpcbQvorIDb7rx3xwa7%2F7cbfec80e1621847e1c15ee2b44cadf8%2FGroup_513718.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

This 50ms benchmark is based on the fact that devices must create a new frame every 16ms (60fps) to maintain a smooth visual experience. However, devices must also perform other tasks, such as responding to user input and executing JavaScript.

The 50ms benchmark allows the device to allocate resources to both rendering frames and performing other tasks, and provides an additional ~33.33ms for the device to perform other tasks while maintaining a smooth visual experience. You can read more about the 50ms benchmark in [this blog post](https://web.dev/rail/#response-process-events-in-under-50ms) covering the RAIL model.

* * *

To maintain optimal performance, it is important to minimize the number of long tasks. To measure the performance of your website, there are two metrics that measure the impact of long tasks on the performance of your applications: Total Blocking Time, and Interaction to Next Paint.

[Total Blocking Time (TBT)](https://vercel.com/docs/concepts/speed-insights#total-blocking-time-tbt) is an important metric that measures the time between the [First Contentful Paint (FCP)](https://web.dev/fcp/) and [Time to Interactive (TTI)](https://web.dev/tti/). TBT is the sum of the time it took tasks longer than 50ms to execute, which can have a significant impact on the user experience.

![The TBT is 45ms, since we have two tasks that took longer than 50ms before TTI, which exceeded the 50ms threshold by 30ms and 15ms respectively. The total blocking time is the accumulation of these values: 30ms + 15ms = 45ms. ](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F41RtV4Ec2hfANDZCMzSQ0T%2Fc5887a6705e95800adddba28a80ca107%2FGroup_513850.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The TBT is 45ms, since we have two tasks that took longer than 50ms before TTI, which exceeded the 50ms threshold by 30ms and 15ms respectively. The total blocking time is the accumulation of these values: 30ms + 15ms = 45ms. ![The TBT is 45ms, since we have two tasks that took longer than 50ms before TTI, which exceeded the 50ms threshold by 30ms and 15ms respectively. The total blocking time is the accumulation of these values: 30ms + 15ms = 45ms. ](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5mn7CDYA1r1bXxEL8fKGca%2Fedb727c0579e82c10c4baf460e310b86%2FGroup_513719.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The TBT is 45ms, since we have two tasks that took longer than 50ms before TTI, which exceeded the 50ms threshold by 30ms and 15ms respectively. The total blocking time is the accumulation of these values: 30ms + 15ms = 45ms.

The [Interaction to Next Paint (INP)](https://web.dev/inp/), a new Core Web Vitals metric, measures the time from a user's first interaction with the page (e.g. clicking a button) to when this interaction is visible on-screen; the next paint. This metric is particularly important for pages with many user interactions, like e-commerce sites or social media platforms. It’s measured by accumulating all the INP measurements throughout the user’s current visit and returning the worst score.

![The Interaction to Next Paint is 250ms, as it's the highest measured visual delay.](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5vnDXGPQNyMid9jisKgHWo%2F595724f51e6efd17dd4758788a3f6898%2FGroup_513851.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The Interaction to Next Paint is 250ms, as it's the highest measured visual delay.![The Interaction to Next Paint is 250ms, as it's the highest measured visual delay.](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4nw8cTyNYL4E7SvSp5IwVX%2F40aac60c0ccfd9a88797216bbc59feb0%2FGroup_513720.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The Interaction to Next Paint is 250ms, as it's the highest measured visual delay.

To understand how the new React updates optimize for these measurements and thus improve the user experience, it's important to understand how traditional React works first.

* * *

### [Traditional React Rendering](#traditional-react-rendering)

A visual update in React is divided into two phases: the **render phase** and the **commit phase**. The render phase in React is a pure computation phase where React elements are reconciled with (i.e. compared to) the existing DOM. This phase involves creating a new tree of React elements, also known as the "virtual DOM", which is essentially a lightweight in-memory representation of the actual DOM.

During the render phase, React calculates the differences between the current DOM and the new React component tree and prepares the necessary updates.

![Group 513852.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7nBju9xmJ9gPUKVzNiFF1u%2Fb76595242c5541f1063154afc513eec8%2FGroup_513852.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513853.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5xBOEIlWqLDo0KtYnRDaqD%2F6aafe87cc002e46a22c97df18b64b896%2FGroup_513853.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

Following the render phase is the commit phase. In this phase, React applies the updates calculated during the render phase to the actual DOM. This involves creating, updating, and deleting DOM nodes to mirror the new React component tree.

* * *

In a traditional synchronous render, React would give the same priority to all elements within a component tree. When a component tree is rendered, either on the initial render or on a state update, React would go ahead and render the tree in a single uninterruptible task, after which it gets committed to the DOM to visually update the on-screen components.

![Group 513854.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5jyRzOC9NYuYY888dFI4qr%2F94f0a56eae8053513f3d3177330540f5%2FGroup_513854.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513744.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F3AycfW6O7Pl3v8CeC6w5ZE%2Fe16fad8cb89dd42826c0aaa2360aa160%2FGroup_513744.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

A synchronous render is an “all-or-nothing” operation, where it’s guaranteed that a component that starts rendering will always finish. Depending on the complexity of the components, the render phase could take a while to complete. The main thread is blocked during this time, meaning that users trying to interact with the application experience an unresponsive UI until React has completed the render and committed the result to the DOM.

* * *

You can see this happen in the following demo. We have a text input field and a large list of cities that get filtered based on the current value of the text input. In a synchronous render, React will go ahead and re-render the **`CitiesList`** component on each keystroke. This is quite an expensive computation since the list consists of tens of thousands of cities, so there’s a clear visual feedback delay here between the keystroke and seeing this reflected in the text input.

App.jsCityList.jsindex.jsstyles.css

To enter the code editing mode, press Enter. To exit the edit mode, press Escape

You are editing the code. To exit the edit mode, press Escape

991234567891011121314import React, { useState } from "react";import CityList from "./CityList";  
export default function SearchCities() { const [text, setText] = useState("Am");  
return ( <main> <h1>Traditional Rendering</h1> <input type="text" onChange={(e) => setText(e.target.value) } /> <CityList searchQuery={text} /> </main> );};Refresh preview

Open on CodeSandboxIf you’re on a high-end device like a Macbook, you might want to throttle your CPU 4x to simulate a lower-end device. You can see this setting in Devtools > Performance > ⚙️ > CPU.

When we look at the performance tab, you can see that long tasks occur on every keystroke, which is suboptimal.

![Tasks marked with the red corner are considered “long tasks”. Note the total blocking time of 4425.40ms. ](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5TSkr22agciO9mBVsFO0WT%2F409f0c76316f80646c1e83bb2600e6e1%2FScreenshot_2023-07-05_at_2.12.35_PM.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)Tasks marked with the red corner are considered “long tasks”. Note the total blocking time of 4425.40ms. ![Tasks marked with the red corner are considered “long tasks”. Note the total blocking time of 4425.40ms. ](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1hWL0jwa9kN4tK5oMEsYdH%2Fa2afb2df2939094b931f0425722f1ca0%2FScreenshot_2023-07-05_at_2.12.35_PM.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)Tasks marked with the red corner are considered “long tasks”. Note the total blocking time of 4425.40ms.

In such scenarios, React developers would often use third-party libraries like [`debounce`](https://www.npmjs.com/package/debounce) to defer the rendering, but there was no built-in solution.

* * *

React 18 introduces a new concurrent renderer that operates behind the scenes. This renderer exposes some ways for us to mark certain renders as non-urgent.

![When rendering the low-priority components (pink), React yields back to the main thread to check for more important tasks](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5hpQJpYBiWcSZJgCmIVhqn%2F9bf89a0119d431224a63755a6966409e%2FGroup_513856.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)When rendering the low-priority components (pink), React yields back to the main thread to check for more important tasks![When rendering the low-priority components (pink), React yields back to the main thread to check for more important tasks](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F3kNTGG4PZ0zQgkYwQuGh87%2F2457e4af9370fdd8d587145fa79856e0%2FGroup_513855.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)When rendering the low-priority components (pink), React yields back to the main thread to check for more important tasks

In that case, React will yield back to the main thread every 5 milliseconds to see if there are more important tasks to handle instead, such as user input or even rendering another React component state updates that are more important to the user experience at that moment. By continuously yielding back to the main thread, React is able to make such renders non-blocking and prioritize more important tasks.

![Instead of a single non-interruptible task for every render, the concurrent renderer yields control back to the main thread at intervals of 5ms during the (re)rendering of low-priority components. ](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7pqW3i6qvuhUeXoUAH6y15%2F2729bf8d5f73d9babfbd402dea8f1aa0%2FGroup_513857.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)Instead of a single non-interruptible task for every render, the concurrent renderer yields control back to the main thread at intervals of 5ms during the (re)rendering of low-priority components. ![Instead of a single non-interruptible task for every render, the concurrent renderer yields control back to the main thread at intervals of 5ms during the (re)rendering of low-priority components. ](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7adRJhijP1o02yuCG8PROt%2F75698e508a60b78170a6bb826a568b98%2FGroup_513750.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)Instead of a single non-interruptible task for every render, the concurrent renderer yields control back to the main thread at intervals of 5ms during the (re)rendering of low-priority components.

Additionally, the concurrent renderer is able to “concurrently” render multiple versions of the component tree in the background without immediately committing the result.

Whereas a synchronous render is an all-or-nothing computation, the concurrent renderer allows React to pause and resume the rendering of one or multiple component trees to achieve the most optimal user experience.

![React pauses the current render based on a user interaction that forces it to prioritize rendering another update](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F31pAf0E13ANPeDhn5kDtqB%2Ffbf036020467569fb018fe92cdf160a8%2FGroup_513858.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)React pauses the current render based on a user interaction that forces it to prioritize rendering another update![React pauses the current render based on a user interaction that forces it to prioritize rendering another update](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F8rcJm5hCwJ38flx2pr1qH%2F7e455aaeb36cceb30005ccffd699f845%2FGroup_513761.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)React pauses the current render based on a user interaction that forces it to prioritize rendering another update

Using concurrent features, React can pause and resume the rendering of components based on external events such as user interaction. When the user started interacting with `**ComponentTwo**`, React paused the current rendering, prioritized and render **`ComponentTwo`**, after which it resumed rendering `**ComponentOne**`. We'll talk about this more in the section on **Suspense.**

* * *

### [Transitions](#transitions)

We can mark an update as non-urgent by using the **`startTransition`** function made available by the `**useTransition**` hook. This is a powerful new feature that allows us to mark certain state updates as “transitions”, indicating that they can lead to visual changes that could potentially disrupt user experience if they were rendered synchronously.

By wrapping a state update in **`startTransition`**, we can tell React that we’re okay with deferring or interrupting the rendering to prioritize more important tasks to keep the current user interface interactive.

```
import { useTransition } from "react";
function Button() {  const [isPending, startTransition] = useTransition();
  return (    <button       onClick={() => {        urgentUpdate();        startTransition(() => {          nonUrgentUpdate()        })      }}    >...</button>  )}
```

When a transition starts, the concurrent renderer prepares the new tree in the background. Once it’s finished rendering, it’ll keep the result in memory until the React scheduler can performantly update the DOM to reflect the new state. This moment could be when the browser is idle and a higher priority task (like user interaction) isn't pending.

![Group 513859.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2AyFMiz1858MXEB8Qow4cC%2F2f48cbbb350790ddd0edb8f2154ce7da%2FGroup_513859.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513860.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F111qjbTgcfkjIUnFT91jov%2Fd582be3dcf51d06a08a74b056fefa01f%2FGroup_513860.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

* * *

Using a transition would be perfect for the **`CitiesList`** demo. Instead of directly updating the value passed to the `**searchQuery**` param on each keystroke – which, in turn, leads to a synchronous render call on each keystroke – we can split the state into two values and wrap the `**searchQuery**`'s state update in a `**startTransition**`.

This tells React that the state update might lead to visual changes that could be disruptive to the user, and therefore React should attempt to keep the current UI interactive while preparing the new state in the background without committing the updates immediately.

index.jsApp.jsCityList.jsstyles.css

To enter the code editing mode, press Enter. To exit the edit mode, press Escape

You are editing the code. To exit the edit mode, press Escape

99123456789101112131415161718192021222324import React, { useState, useTransition } from "react";import CityList from "./CityList";  
export default function SearchCities() { const [text, setText] = useState("Am"); const [searchQuery, setSearchQuery] = useState(text); const [isPending, startTransition] = useTransition();  
return ( <main> <h1><code>startTransition</code></h1> <input type="text" value={text} onChange={(e) => { setText(e.target.value) startTransition(() => { setSearchQuery(e.target.value) }) }} /> <CityList searchQuery={searchQuery} /> </main> );};Refresh preview

Open on CodeSandbox

Now when we type in the input field, the user input remains smooth without any visual delays between keystrokes. This happens since the `**text**` state is still updated synchronously, which the input field uses as its `**value**`.

In the background, React starts rendering the new tree on each keystroke. But instead of this being an all-or-nothing synchronous task, React starts preparing the new version of the component tree in memory while the current UI (showing the "old" state) remains responsive to further user input.

Looking at the performance tab, wrapping the state update in a **`startTransition`** significantly decreased the number of long tasks and the total blocking time compared to the performance graph for the implementation without the use of transitions.

![The performance tab shows that the number of long tasks and the total blocking time have reduced significantly.](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2FM1dFGbcX3mxerAn1U6Bbi%2F8525d99eb629e72c61ff90459f57523c%2FScreenshot_2023-07-05_at_2.20.04_PM.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The performance tab shows that the number of long tasks and the total blocking time have reduced significantly.![The performance tab shows that the number of long tasks and the total blocking time have reduced significantly.](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2FM1dFGbcX3mxerAn1U6Bbi%2F8525d99eb629e72c61ff90459f57523c%2FScreenshot_2023-07-05_at_2.20.04_PM.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)The performance tab shows that the number of long tasks and the total blocking time have reduced significantly.

Transitions are part of a fundamental shift in React's rendering model, enabling React to render muliple versions of the UI concurrently, and manage priorities between different tasks. This allows for a smoother and more responsive user experience, especially when dealing with high-frequency updates or CPU-intensive rendering tasks.

* * *

### [React Server Components](#react-server-components)

React Server Components are an **experimental feature** in React 18, but [ready for frameworks to adopt](https://react.dev/blog/2023/05/03/react-canaries). This is important to know before we delve into Next.js.

Traditionally, React offered a few primary ways to render our app. We could either render everything entirely on the client (Client-Side Rendering), or we could render the component tree to HTML on the server and send this static HTML to the client with a JavaScript bundle to hydrate the components client-side (Server-Side Rendering).

![Group 513884.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F3IlisGw5xb4P8LHpNN9wlo%2Fe58e94b10d366fb43828e44a8a196fe7%2FGroup_513884.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513886.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6msihsNMV9mTIEQ3syXLJ3%2F68385786d75731ea88f6886c2a0834f4%2FGroup_513886.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

Both approaches rely on the fact that the synchronous React renderer needs to rebuild the component tree client-side which the use of the shipped JavaScript bundle, even though this component tree was already available on the server.

* * *

React Server Components allow React to send the actual serialized component tree to the client. The client-side React renderer understands this format and uses it to performantly reconstruct the React component tree without having to send the HTML file or JavaScript bundle.

![Group 513889.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F30Zy2ussNyOohhbqcrEJNU%2F8a3b527220ee2a3929d94b7b799911fc%2FGroup_513889.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513889.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6ZsyTea06wVCwlErW4JB14%2Fe14e0a2569ae470ed3236d041f4c6a97%2FGroup_513889.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

We can use this new rendering pattern by combining `**react-server-dom-webpack/server**`'s `**renderToPipeableStream**` method with **`react-dom/client`**'s `**createRoot**` method.

```
// server/index.jsimport App from '../src/App.js'app.get('/rsc', async function(req, res) {    const {pipe} = renderToPipeableStream(React.createElement(App));  return pipe(res);});
---// src/index.jsimport { createRoot } from 'react-dom/client';import { createFromFetch } from 'react-server-dom-webpack/client';export function Index() {  ...  return createFromFetch(fetch('/rsc'));}const root = createRoot(document.getElementById('root'));root.render(<Index />);
```

⚠️ This is an over-simplified (!) example of the CodeSandbox demo shown below.

[Click here to see the full CodeSandbox demo](https://codesandbox.io/p/sandbox/cocky-minsky-m7sgfx). In the next section, we'll cover a more elaborate example.

* * *

By default, React won't hydrate React Server Components. The components aren't expected to use any client-side interactivity like accessing the **`window`** object or use hooks like **`useState`** or `**useEffect**`.

To add a component and its imports to a JavaScript bundle that gets shipped to the client, thus making it interactive, you can use the ["use client" bundler directive](https://react.dev/reference/react/use-client) on the top of the file. This tells the bundler to add **this component and its imports** to the client bundle and tells React to hydrate the tree client-side to add interactivity. Such components are referred to as Client Components.

![Note: Framework implementations may differ. For example, Next.js will prerender Client Components to HTML on the server, similar to the traditional SSR approach. By default, however, Client Components are rendered similar to the CSR approach.](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4Jv34PlBgWlR9XI7eqRwZ5%2F862e02e8630eda4022f767e3d8c86153%2FGroup_513894.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)Note: Framework implementations may differ. For example, Next.js will prerender Client Components to HTML on the server, similar to the traditional SSR approach. By default, however, Client Components are rendered similar to the CSR approach.![Note: Framework implementations may differ. For example, Next.js will prerender Client Components to HTML on the server, similar to the traditional SSR approach. By default, however, Client Components are rendered similar to the CSR approach.](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F33iH3Yg6XfVbKfJEytviR%2Fc1de8e05883194b93fed7b6635e9098e%2FGroup_513895.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)Note: Framework implementations may differ. For example, Next.js will prerender Client Components to HTML on the server, similar to the traditional SSR approach. By default, however, Client Components are rendered similar to the CSR approach.

It's up to the developer to optimize bundle size when working with Client Components. Developers can do this by:

*   Ensuring that only the leaf-most node of the interactive component defines the **`"use client"`** directive. This may require some component decoupling.
*   Passing component trees as props rather than importing them directly. This allows React to render the **`children`** as React Server Components without adding them to the client bundle.

* * *

### [Suspense](#suspense)

Another important new concurrent feature is [**`Suspense`**](https://react.dev/reference/react/Suspense). Although it’s not entirely new as `**Suspense**` was released in React 16 for code-splitting with **`React.lazy`**, the new capabilities introduced with React 18 extend `**Suspense**` to data fetching.

Using **`Suspense`**, we can delay the rendering of a component until certain conditions are met, such as data being loaded from a remote source. In the meantime, we can render a fallback component that indicates that this component is still loading.

By declaratively defining loading states, we reduce the need for any conditional rendering logic. Using `**Suspense**` in combination with React Server Components allows us to directly access server-side data sources without requiring a separate API endpoint, such as databases or the file system.

```
async function BlogPosts() {  const posts = await db.posts.findAll();  return '...';} export default function Page() {  return (    <Suspense fallback={<Skeleton />}>      <BlogPosts />    </Suspense>  )}
```

Using React Server Components works seamlessly with Suspense, which allows us to define a loading state while the component is still loading.

The true power of **`Suspense`** comes from its deep integration with React's Concurrent features. When a component is suspended, for example because it’s still waiting for data to load, React doesn't just sit idle until the component has received the data. Instead, it pauses the rendering of the suspended component and shifts its focus to other tasks.

![Group 513896.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5HOB07faANLKHmnEM827xY%2F3cefc34397a0a208c25d1800b6e30e63%2FGroup_513896.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513799.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6Bit3X6J9YKFhufpBImjCx%2Fe215dfb092345641190d9477d6c94a6a%2FGroup_513799.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

During this time, we can tell React to render a fallback UI to indicate that this component is still loading. Once the awaited data becomes available, React can seamlessly resume the rendering of the previously suspended component in an interruptible way, like we previously saw happening with transitions.

React can also reprioritize components based on user interaction. For example, when a user interacts with a suspended component that's not currently being rendered, React suspends the ongoing render and prioritizes the component that the user is interacting with.

![Group 513897.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5wpuLId1tEaE8cC18ERmfk%2F7e0fc704dbdab08b92d70035221e4fa1%2FGroup_513897.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513898.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2lfveiABDvarpCmCTuKxeK%2Ffc9957a2762ce8226135b946669bd44d%2FGroup_513898.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

Once it's ready, React commits it to the DOM, and resumes the previous render. This ensures that user interactions are prioritized and the UI remains responsive and up-to-date with user inputs.

The combination of `**Suspense**` with React Server Component’s streamable format allows high-priority updates to be sent to the client as soon as they're ready, without waiting for lower-priority rendering tasks to complete. This enables the client to start processing data sooner and provides a more fluid user experience by gradually revealing content as it arrives in a non-blocking manner.

This interruptible rendering mechanism combined with **`Suspense`**'s ability to handle asynchronous operations provides a much smoother and more user-centric experience, particularly in complex applications with significant data-fetching needs.

* * *

### [Data Fetching](#data-fetching)

Besides rendering updates, React 18 also introduces a new API to fetch data and memoize the result efficiently.

React 18 now has a [cache function](https://nextjs.org/docs/app/building-your-application/data-fetching/caching#react-cache) that remembers the result of the wrapped function call. If you call the same function with the same arguments _within the same render pass_, it will use the memoized value without the need to execute the function again.

```
import { cache } from 'react' export const getUser = cache(async (id) => {  const user = await db.user.findUnique({ id })  return user;})
getUser(1)getUser(1) // Called within same render pass: returns memoized result.
```

In `**fetch**` calls, React 18 now includes a similar caching mechanism by default without having to use `**cache**`. This helps to reduce the number of network requests in a single render pass, which improves application performance and lowers API costs.

```
export const fetchPost = (id) => {  const res = await fetch(`https://.../posts/${id}`);  const data = await res.json();  return { post: data.post } }
fetchPost(1)fetchPost(1) // Called within same render pass: returns memoized result.
```

These features are helpful when working with React Server components, as they cannot access the Context API. The automatic caching behavior of both cache and fetch allows exporting a single function from a global module and reusing it throughout the application.

![Group 513901.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5GjQk9vFs1ZdldkLCQZSIa%2Feeb3c1f82145a77d64efca65ff612963%2FGroup_513901.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)![Group 513902.png](/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2zH5ZDltwOKhjStHVRJnNR%2F715545b4f1cdef3ff5789d59bc8cc257%2FGroup_513902.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

```
async function fetchBlogPost(id) {  const res = await fetch(`/api/posts/${id}`);  return res.json();} 
async function BlogPostLayout() {  const post = await fetchBlogPost('123');  return '...'}async function BlogPostContent() {  const post = await fetchBlogPost('123'); // Returns memoized value  return '...'}
export default function Page() {  return (    <BlogPostLayout>      <BlogPostContent />    </BlogPostLayout>  )}
```

* * *

### [Conclusion](#conclusion)

In summary, React 18's latest features improve performance in many ways.

*   With **Concurrent React**, the rendering process can be paused and resumed later or even abandoned. This means the UI can respond immediately to user input even if a large rendering task is in progress.
*   The **Transitions API** allows for smoother transitions during data fetches or screen changes without blocking user input.
*   **React Server Components** lets developers build components that work on both the server and client, combining the interactivity of client-side apps with the performance of traditional server rendering without the cost of hydration.
*   The extended **`Suspense`** functionality improves loading performance by allowing parts of the application to render before others that may take longer to fetch data.

* * *

Developers using [Next.js's App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration) can start taking advantage of the features now available for frameworks, like **`cache`** and Server Components, mentioned in this blog post. In an upcoming blog post, we'll cover how the Next.js App Router leverages these performance features to enhance your application even further.

Explore more

[

See it in action

![See it in action](/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2FK2veyjyShVJNZe7vSeesu%2F3601229eb0f65fc3a08e62bd22bed2f4%2Fimage.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)](https://formidable.dev/blog/2023/powering-our-website-s-evolution-next-js-app-router-and-sanity-cms-in-action/)[

Deploy this template

![Screenshot of template](/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2Fk9BYNIi5HwkHop568SjEI%2Fcfb7e8215a11667d32265b34c43b4b5b%2FCleanShot_2022-10-25_at_14.38.59_2x.png&w=3840&q=75&dpl=dpl_P6FQeMwAsWdqUcc4vxoPhdgBkGbc)

by ▲ Vercel

](/templates/next.js/app-directory)

Related reading

[

Upgrading Next.js for instant performance improvements

](/blog/upgrading-nextjs-for-instant-performance-improvements)![Avatar for lydiahallie](/api/www/avatar?u=lydiahallie&s=40 "Avatar for lydiahallie")

Lydia Hallie

[

Migrating a large, open-source React application to Next.js and Vercel

](/blog/migrating-a-large-open-source-react-application-to-next-js-and-vercel)![Avatar for manovotny](/api/www/avatar?u=manovotny&s=40 "Avatar for manovotny")

Michael Novotny

[

Behind the scenes of Vercel's infrastructure: Achieving optimal scalability and performance

](/blog/behind-the-scenes-of-vercels-infrastructure)![Avatar for lydiahallie](/api/www/avatar?u=lydiahallie&s=40 "Avatar for lydiahallie")

Lydia Hallie