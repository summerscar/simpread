> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.bbss.dev](https://www.bbss.dev/posts/react-learn-suspense/)

> Suspense has been a feature in React since v16.6.0. Despite this, I haven’t seen much of it in action......

Suspense ([along with concurrent rendering](https://www.bbss.dev/posts/react-concurrency/)) has been a feature in React since [v16.6.0](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html). Despite this, I haven’t seen much of it in action beyond `React.lazy` and limited applications of “suspense-enabled libraries”.

What’s going on?

As of the impending React v19 release, Suspense is still not quite ready for primetime. The story of its APIs and internals still seems incomplete. In fact, the React team seems to think it’s _so_ incomplete that the Suspense API is entirely undocumented. The [Suspense documentation](https://19.react.dev/reference/react/Suspense) insists that the only way of using Suspense is via “Suspense-enabled frameworks”.

I think that purposefully hiding APIs in documentation is silly, but fine! I’ll play their game! Let’s build a Suspense-enabled library, and use it.

We will peel back the curtain of Suspense along the way.

The Philosophy[⌗](#the-philosophy)
----------------------------------

Before jumping straight into Suspense, let’s build a simple data-fetching component to see where we are without it.

If you take a React 101 course, it will generally teach you to write code like this when fetching data:

The next thing that course will teach you is that this code is actually bad. It’s missing a bunch of things like:

*   Error state handling
*   Pending state handling
*   Race condition handling
*   Shared caching (this will be covered later)

Once implemented, our component looks more like this:

At this point, the course instructor will usually tell you that this is good, but you’re bound to be repeating this code every time you need to fetch data, and will then proceed to teach you about writing your first hook.

While I respect the pedagogical needs, that is actually not the best way to approach it. The problem with tracking pending and error states is that even if you bury it in a hook, you will still need to handle those states at the component level.

Imagine if `useFetch` could handle returning `SpinnerFallback` and `ErrorFallback` for us.

In the case of `ErrorFallback`, we have [error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

As for `SpinnerFallback`, that is actually what Suspense is for. We’ll eschew the implementation that triggers the fallback mechanism to avoid distractions (we’ll come back to it later, don’t worry!), but it looks like this from the component perspective:

At this point, don’t dwell on how `useFetch` is implemented. We have a long way to go before it’s usable.

Beware: Boundaries Reset State[⌗](#beware-boundaries-reset-state)
-----------------------------------------------------------------

A side-effect of using boundaries for handling pending and error states is that when a boundary is hit, all its children are discarded in favor of the `fallback`. The result is that their state is lost.

Try it out:

This is often desirable. For example, if your component entered a bad state, the surest way of getting it out is a complete reset.

> **Tip:** by strategically placing your boundaries, you can control which parts of your application are reset together.  
> Remember that you can wrap more than just your root, but you also don’t need to wrap every single component.  
> This is true for both error boundaries and suspense boundaries.

In terms of tracking pending states, this poses a challenge. On the initial render, the state is pending. This will trigger the Suspense boundary. If the Suspense boundary is reset, then the component will remount, send a new request, and trigger the boundary again. As such, successfully displaying data is not possible under such a paradigm without having a continuous reference to the same request.

A cache that lives longer than the component lifetime is necessary.

### You've Got Mail!

No more than five emails per year, all densely packed with knowledge.

Shared caching is important. It’s essential to avoid out-of-sync data, sending too many requests, and implementing advanced data management features. In our case, it’s also critical to make components dumber, and not responsible for managing the state of their requests, which would otherwise be lost.

Caching is hard to do right. In truth, it’s hard enough that data-fetching libraries are mostly caching libraries.

We’ll avoid going down the _“how to write a cache”_ rabbit hole by keeping our cache intentionally simplistic. Its API will allow us to request a specific URL from it, and it will give us back values for `data`, `pending`, and `error` just like before. The only difference will be that the request lifecycle will be managed within the cache – not within the component making the request.

We will then turn the cache into a real Suspense-enabled library.

### FetchCache Class[⌗](#fetchcache-class)

You can get creative with the exact APIs, and features your cache has. Here’s a minimal implementation:

This `FetchCache` has 2 methods:

*   `fetchUrl(url, refetch)`

Request a URL.  
Returns its current state in the cache.

*   `subscribe(callback)`

Register a callback for notifications when new data is available in the cache.  
Returns a function to unsubscribe.

### FetchCache Provider[⌗](#fetchcache-provider)

Now that we have a cache, we require the means to expose it to our React tree: a Context Provider.

### useFetch Hook[⌗](#usefetch-hook)

Lastly, we will write a `useFetch` hook to leverage the `FetchCacheProvider`:

Note that we’re keeping the API consistent with our initial example.

### In Action![⌗](#in-action)

> This demo uses Users and Posts instead of Artists and Albums. Powered by [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)

Try clicking the Refresh buttons and see what happens. Break the URLs to make the request purposefully fail.

Feel free to explore the codebase, and make sure you have a good understanding of what’s going on until we continue. Re-read previous sections if something doesn’t make sense.

Tracking Data as Promises[⌗](#tracking-data-as-promises)
--------------------------------------------------------

So far, we’ve been consistently using promises without thinking too much about them. Remember that Promises have 3 possible states:

*   Pending
*   Fulfilled with value (where value could also be `undefined` or `null`)
*   Rejected with reason (where the reason is typically an `Error`, but doesn’t _need_ to be)

In principle, we don’t need to track this information separately from the Promise, as we do in `FetchCache`. We could just track the promise by itself while using a special function to read information from it.

The challenge here is that Promises only allow for asynchronous data access (even if they are already settled):

We need a way to read its state synchronously to extract the data. We can do this by adding extra properties to the Promise object to track its state.

The first time we call `readPromiseState` with a Promise, it will return `pending`. But once it settles, it will update its own state in a way that is accessible to us.

Try in your REPL of choice:

> **Spoiler**: You might think that this is improper, but this is exactly what [React v19’s `use`](https://github.com/facebook/react/blob/1b0132c05acabae5aebd32c2cadddfb16bda70bc/packages/react-server/src/ReactFlightThenable.js#L65C16-L65C23) does under the hood.

Using Promises in the Cache[⌗](#using-promises-in-the-cache)
------------------------------------------------------------

In this section, we will lightly modify our `FetchCache` to track Promises using `readPromiseState` instead of state objects. The changes are fairly light.

You can paste it into your fork of the previous CodeSandbox to see that **no other changes are necessary**. This demonstrates that we have all the data we need in the Promise itself.

We will now make one more change, where instead of using `readPromiseState` in the `FetchCache`, we will move to the `useFetch` hook.

Enable Suspense 🎉[⌗](#enable-suspense-)
----------------------------------------

The final change we’re going to make is to turn `useFetch` into a Suspense hook.

Remember how we would trigger the error boundary by throwing an `Error`? **Triggering a Suspense boundary is the same, except you throw a `Promise`**.

To escape an error boundary, you need to have some code that makes the call to reset it. The Suspense boundary on the other hand will automatically reset itself when the Promise is resolved (or will trigger an error boundary if it’s rejected).

Enabling Suspense for `useFetch` will require 2 changes.

First, it will need to throw the Promise if it’s pending.

Second, it will need to throw the reason (which is an `Error`) if the Promise is rejected.

If the Promise has been fulfilled, it can simply return the data. The consuming component no longer needs to consider error or pending states.

Next, update the components that use `useFetch` to consume the data directly…

…and wrap the application in a Suspense and ErrorBoundary.

A best practice here is to always wrap your application root in both `ErrorBoundary` and `Suspense`. Remember to be mindful that anything contained in either of them will have their local state reset when the boundary is triggered.

Try it on the CodeSandbox:

> **Exercise for the reader:** This time, when you click the refresh buttons, the entire app turns into a loading state. Why is this, and how can you restore the previous behavior?  
> **Hint**: throwing an error or a promise triggers the **nearest** boundary.

Whoops. We Just Re-Invented `use()`![⌗](#whoops-we-just-re-invented-use)
------------------------------------------------------------------------

React v19 is introducing a new hook: [`use`](https://react.dev/reference/react/use). It can consume data from a context (similar to `useContext`) or a `Promise`. Let’s see what it looks like when we introduce `use` to `useFetch`:

Neat!

Review[⌗](#review)
------------------

### You've Got Mail!

No more than five emails per year, all densely packed with knowledge.

In this post, we have learned:

*   How Suspense helps with writing shorter component functions
*   How to persist state when a boundary is triggered
*   How to read from a Promise “synchronously”
*   How to write a “Suspense-enabled” hook
*   What the `use()` hook does to Promises

Ending Notes[⌗](#ending-notes)
------------------------------

Congratulations on finishing reading! If you followed along, you should now have the knowledge needed to build your own Suspense-enabled hooks. More importantly, you should now feel empowered in debugging Suspense when things go wrong.

While some of the implementations featured in the post might seem awkward; everything is broadly representative of how real Suspense-enabled libraries work.

For example, if you look at TanStack Query, the mappings should be pretty clear:

*   `useQuery` -> `useFetch`
*   `QueryClient` -> `FetchCache`
*   `QueryClientProvider` -> `FetchCacheProvider`

The practical differences are in the features available.

### FetchCacheProvider Implementation[⌗](#fetchcacheprovider-implementation)

While we used a global instance of `FetchCache` for persisting the fetch states, it could’ve been a locally initialized instance within the context, as long as it was outside the Suspense and Error boundaries, which would otherwise reset it:

This implementation of the provider would’ve worked just as well. It is, however, bad practice.

Writing the `FetchCacheProvider` in this way creates a tight coupling between it and the specific `FetchCache` implementation. In turn, this makes `FetchCacheProvider` unable to accept alternative implementations that use a different fetching mechanism (Axios, GraphQL, mocks for unit tests, etc).

### What is missing from Suspense?[⌗](#what-is-missing-from-suspense)

Render-level caching is something that the React team has previously alluded to delivering. The idea is that we could cache data (like Promises) within some internal React context, which would survive state resets.

This could allow Suspense implementations based on “local” state, that doesn’t require a context or global cache. It’s still a moving target in terms of implementation, so there’s not much else to say.

Aside from that, Suspense API seems pretty complete to me. I don’t understand the React team’s aversion to documenting it.

### Transitions[⌗](#transitions)

I won’t be going into specifics in this post, but [the documentation is pretty good](https://react.dev/reference/react/useTransition) as far as Suspense-Transition interactions go. If you’re building on Suspense, that page is mandatory reading.

Especially with the upcoming v19 changes, there is much more to `useTransition` than just Suspense. I’ll be covering the hook in its entirety in a future post after the official v19 release.

[Subscribe](https://knyz.us16.list-manage.com/subscribe/post?u=7f1e0c3bc2050cf817bfa6368&id=ec86591d5f) to the newsletter to be the first to the complete guide to `useTransition`.