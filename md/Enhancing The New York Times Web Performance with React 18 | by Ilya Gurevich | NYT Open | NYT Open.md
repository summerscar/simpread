> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [open.nytimes.com](https://open.nytimes.com/enhancing-the-new-york-times-web-performance-with-react-18-d6f91a7c5af8)

> How upgrading to React 18 energized The New York Times website — and how we tackled some of the chall......

How upgrading to React 18 energized The New York Times website — and how we tackled some of the challenges we faced along the way.
----------------------------------------------------------------------------------------------------------------------------------

[

![](https://miro.medium.com/v2/resize:fill:88:88/1*H66kKIaOlyMAd6drqVQKNQ.png)

](https://medium.com/@timesopen?source=post_page-----d6f91a7c5af8--------------------------------)[

![](https://miro.medium.com/v2/resize:fill:48:48/1*QUlYX1snC5csKT-E6Bmxvw.jpeg)

](https://open.nytimes.com/?source=post_page-----d6f91a7c5af8--------------------------------)![](https://miro.medium.com/v2/resize:fit:1400/1*rT1gMg-9ensw1FDxaAaq_Q.gif)Illustration by Ben Hickey

**By Ilya Gurevich**

As software engineers at The New York Times, we place a high value on page performance, SEO, and keeping up to date with the latest technology. With those priorities in mind, the release of React 18 stood out to us as a significant and tangible leap forward in the ever-expanding world of web development. For our React-based sites, the upgrade promised a performance boost and access to exciting new features. Last winter, we set out to embrace the powers of React 18 on our flagship core news site. Along the way, we encountered some unique peculiarities — both in React and in our own site — that we had to learn to navigate through. In the end, we achieved big performance gains and unlocked a world of future improvements that we’re still exploring.

Before we dive into our process for upgrading, let’s take a look at a few of the major benefits and changes in React 18:

*   **Smoother Rendering with Concurrent Mode:** React 18 introduces Concurrent Mode, a paradigm shift that allows for simultaneous rendering of updates and user interactions. This translates to smoother animations, less screen jank and cumulative layout shift, and a more responsive user experience.
*   **Automatic Batching and Transitions:** To take full advantage of concurrency, React 18 automatically batches state updates within a single render cycle, optimizing performance. It does so by breaking up tasks in the main thread, which is a big shift from prior mechanics, where almost all tasks were synchronously executed. The introduction of new [useTransition](https://react.dev/reference/react/useTransition) hooks also allows engineers to ensure that certain states will update without blocking the UI.
*   **Exciting New Features:** React 18 paves the way for exciting functionalities like server-side rendering and streaming updates through [react server components](https://react.dev/reference/rsc/server-components) and selective hydration, opening doors to innovative UI patterns and faster initial renders.

The performance gains were particularly important to us because they promised significant improvements in our Interaction to Next Paint (INP) scores. INP is a measure of page responsiveness and is the newest Core Web Vital, a set of metrics that Google uses to rank websites in search results. SEO scores are vital for a news organization, and improving our INP scores had been a difficult challenge for us, making the React upgrade a high-priority (and high-stakes) initiative.

1.  **Removing Deprecated Dependencies**

Before we could get started with the migration itself, we needed to remove a deprecated Enzyme testing library that was incompatible with React 18. To do that, we had to manually migrate all of our test files to the more up-to-date library, [**@testing-library/react**](https://testing-library.com/docs/react-testing-library/intro/)**.** In terms of time commitment, this might have been the biggest piece of the entire project. Enzyme was used in hundreds of test files across our repository, and it required a significant manual effort and dozens of pull requests to fully replace it. We accomplished this effort over the course of several months with incremental pull requests in order to accommodate other product work and avoid developer fatigue. At the end of the effort, we definitely felt like experts in the [**@testing-library/react**](https://testing-library.com/docs/react-testing-library/intro/) API, and we were thankful to move on to the React 18 upgrade itself.

**2. Foundation Setting**

With the test file migration out of the way, we could begin work on integrating React 18. In order to accomplish this safely, we first started by upgrading all of our major dependencies, types and tests to conform to React 18, without implementing the latest features themselves. This involved simply upgrading everything from @types/react, react-test-renderer, react-dom, and @testing-library to the latest versions in our package.json files across our repository. Upgrading all major dependencies also involved refactoring some test and type definitions to conform to the latest versions as well.

**3. Turning on the Engines**

Once we felt confident in our package upgrades, we were ready to safely integrate the new functionality of React 18. To turn the features into reality, we needed to utilize the latest APIs: [createRoot](https://react.dev/reference/react-dom/client/createRoot) and [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot). We have several instances across multiple web servers where we’ve integrated React Hydration, with a set of shared UI components rendered between all of them, so it was important for us to enable React 18 functionality in as many places as we could. At first glance, it looks as simple as changing references from **ReactDOM.hydrate** to **hydrateRoot.** But was it really?

**Unexpected Challenges**

As developers, it’s easy to get overconfident when you hit the “deploy to production” button. Your end-to-end integration and unit tests are passing, you’ve covered QA across various surfaces and devices, and you’re moments away from getting that latest feature out the door. We all felt that way when we initially deployed the latest version of React to The New York Times website. Soon after our initial deployment of the new upgrades, we encountered a problem with some highly trafficked content, namely on a content-type we call “embedded interactives”.

![](https://miro.medium.com/v2/resize:fit:1400/0*yqosD8m1lIRtZRh4)A custom embedded interactive built by our graphics developers: [https://www.nytimes.com/article/hurricane-norma-baja-california.html](https://www.google.com/url?q=https%3A%2F%2Fwww.nytimes.com%2Farticle%2Fhurricane-norma-baja-california.html&sa=D&ust=1719425021820790&usg=AOvVaw0Wy7DlTRRsTiyaAjg31xhe)

At The New York Times, we use custom embedded interactives rendered server-side with [dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html). These interactives have their own HTML, links, and scripts, running independently of the React tree. This allows editors and journalists to inject one-off, self-contained visual and [interactive elements](https://www.nytimes.com/2023/10/27/business/kanye-west-adidas-yeezy.html) into our pages without having to alter or re-deploy core infrastructure. Embedded interactives are the key to some of our most impactful reporting, but they can also pose real challenges for developers.

A simplified example might look something like this (where script tags will modify the DOM as soon as the page has opened):

```
const embeddedInteractiveString = `
  <div>server</div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const serverTestElement = document.getElementById("server-test");
      serverTestElement.textContent = "client";
    });
  </script>
`;
return <div dangerouslySetInnerHTML={{ __html: embeddedInteractiveString }} />;

```

In this setup, the script modifies the “server-test” element’s content from “server” to “client” after page load. This works because browser-rendered scripts execute before React hydrates the DOM. It’s essentially a “black box,” where we trust the injected HTML and its scripts to behave as intended.

**The Hydration Hurdle**

Enter React 18, with its stricter hydration mismatch requirements. Under the new rules, any DOM modifications between the initial browser load and client-side hydration trigger a fallback to client-side rendering. In our example, even though the script tag modifies the “server-test” element before hydration, in a hydration mismatch, React will discard the server-rendered content and fall back to client-side rendering, essentially nullifying the script’s impact. In previous versions of React, even if there was a hydration mismatch, the React team opted to leave the version of the DOM in an [invalid state](https://github.com/facebook/react/issues/27848#issuecomment-1883713988) as opposed to re-rendering entirely on the client, which is why we didn’t experience any issues in the past.

In practice, what does this mean? Well, when rendering components on the client using the dangerouslySetInnerHTML prop, any bit of HTML containing a <script> tag inside of it will not run due to browser security considerations. This means that any embedded interactive that is re-rendered on the client due to hydration mismatches using the dangerouslySetInnerHTML prop will essentially render as if the javascript had never been executed. In our example above, the text content will change from “server” to “client,” but on a hydration mismatch, it will re-render as “server.” This ended up making some of our embedded interactives look wildly different from the expected render.

**Expected:**

![](https://miro.medium.com/v2/resize:fit:1400/0*iL0ORQWV_QeM9ty5)

**Actual:**

![](https://miro.medium.com/v2/resize:fit:1400/0*kcvw3Bu9X7OLN-1x)

**So what do we do?**

Given that React 18 was significantly more sensitive to hydration mismatches than React 16, we essentially had two choices in front of us. The first was to fix all potential hydration mismatches in our website. The second was to adapt embedded interactives to re-mount on the client as a fallback should a hydration mismatch occur. This left us in a bit of a dilemma. The New York Times has published millions of articles with hundreds of different components and tens of thousands of custom embedded interactives. Of course we wanted to fix all of our hydration mismatches, but how could we do so safely?

In the end, we decided to tackle both problems at the same time.

We know that script tags, when added via the innerHTML prop (or during a client-side re-render), will not run automatically because of browser security considerations. So how do we get around this? Script tags will only run when manually appended or replaced as a childNode to another element in the DOM. This means that in order to properly run script tags, we must first extract and remove them from the interactive HTML and then **append them back into the right location in the embedded interactive** HTML when the component re-renders.

```
// This function replaces script tags in generic html with empty placeholders.
// This allows us to replace the script tag reference in-place later on client-mount with the actual script.
export const addsPlaceholderScript = (scriptText, id, scriptCounter) => {
  let replacementToken = '';
  let hoistedText = scriptText;

  replacementToken = `<script id="${id}-script-${scriptCounter}"></script>`;
  hoistedText = hoistedText.replace('<script', `<script id="${id}-script-${scriptCounter}"`);

  return {
    replacementToken,
    hoistedText,
  };
};

// This function extracts and removes `<script>` tags from an interactive HTML string
// and returns an object containing:
// - `scriptsToRunOnClient`: An array of script texts to be run on client-mount.
// - `scriptlessHtml`: The modified HTML string with scripts removed with empty script references.
export const extractAndReplace = (html, id) => {
  const SCRIPT_REGEX = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  let lastMatchAdjustment = 0;
  let scriptlessHtml = html;
  let match;
  const scriptsToRunOnClient = [];
  let scriptCounter = 0;
  while ((match = SCRIPT_REGEX.exec(html))) {
    const [matchText] = match;
    if (matchText) {
      let hoistedText = matchText;
      let replacementToken = '';
      ({ hoistedText, replacementToken } = addsPlaceholderScript(hoistedText, id, scriptCounter));
      scriptCounter += 1;
      const start = match.index - lastMatchAdjustment;
      const end = match.index + matchText.length - lastMatchAdjustment;
      scriptlessHtml = `${scriptlessHtml.substring(
        0,
        start
      )}${replacementToken}${scriptlessHtml.substring(end, scriptlessHtml.length)}`;
      scriptsToRunOnClient.push(hoistedText);
      lastMatchAdjustment += matchText.length - replacementToken.length;
    }
  }

  return {
    scriptsToRunOnClient,
    scriptlessHtml,
  };
};

// Run script on client
const runScript = (clonedScript) => {
    const script = document.getElementById(document.getElementById(`${clonedScript.id}`))
    script.parentNode.replaceChild(clonedScript, script);
}

```

You may be asking, _why not keep scripts on the server and then re-run them on the client_? One reason why this is not possible in some scenarios is that some script tags declare variables globally instead of within a function closure. If you were to pre-render those script tags on the server and then re-run them on the client, you would encounter errors due to redeclaration of global variables, which is not possible.

That initial solution fixed many of our embedded interactives. Unfortunately, not every interactive plays well with arbitrarily-ordered script execution. Here’s where we navigate some nuances:

**Script Load Ordering**

Some interactive scripts, when appended back to the embedded interactive HTML, must be loaded in the correct order. Previous script execution strategies automatically assumed that all <script> tags had already been declared and pre-rendered on the server. Now that we are stripping out script tags and re-mounting them on the client, some inherent logic based on these principles are going to break. Let’s walk through an example.

```
<script>
  const 
results = document.getElementById("RESULTS_MANIFEST").innerHTML.ELECTION_RESULTS;
  // do additional logic with results
</script>
<div>
  Interactive DOM Content Goes here
</>div>
<script id="RESULTS_MANIFEST>{"ELECTION_RESULTS": ['result1', 'result2', ....]}</script>

```

In the scenario above, we have an initial script that searches for another script tag by ID and then utilizes some existing logic based on the innerHTML of the second script tag. In previous iterations, since script tags used to be pre-rendered on the server, there wouldn’t be any issue referencing a script tag by ID as the script tag would be available in the DOM by default.

For optimal interaction, script execution needs to follow a specific order when re-appended to the DOM. This involves:

1.  Appending non-functional manifest scripts containing static data first.
2.  Executing scripts with src attributes asynchronously next.
3.  Finally, appending and executing scripts with vanilla JavaScript in their innerHTML.

This sequencing prevents scripts from referencing each other before they’re properly loaded.

```
// Parses the provided script tag, returning a priority for sorting.
// Priority 1: for JSON or other metadata content.
// Priority 2: for other vanilla JS or src contents
export const getPriority = template => {
  let priority;
  try {
    JSON.parse(template.innerHTML);
    priority = 1;
  } catch (err) {
    priority = 2;
  }
  return priority;
};

scripts.sort((a, b) => getPriority(a) - getPriority(b));

```

After integrating these very fine-tuned — almost surgical — manipulations of our embedded interactive code, we felt that we were able to safely release React 18 into the wild again. While we would never be able to extensively QA nearly 40,000 custom-created embedded interactives, we were able to rely on a few reusable templates that the graphics team often returns to. This let us validate specific behavior within our Svelte or Adobe Illustrator-based embedded interactives. In the long term, we’re committed to squashing our remaining hydration mismatches and achieving complete peace of mind. But in the short term, we were ready to push the “deploy” button again.

Once we released the new features (and spent an hour nervously monitoring internal alerts for any issues), we saw almost immediate performance improvements.

![](https://miro.medium.com/v2/resize:fit:1400/0*MtMev3JHmEYYsbne)

As you can see from this chart, INP scores in the p75 range dropped by roughly 30%!

Before the upgrade, one of our biggest challenges had been the frequent re-renders our news site went through as it loaded pages. That caused a poor user experience (and sub-par INP scores) when the user tried to interact with the still-loading page.

After the React 18 upgrade, our re-renders were cut essentially in half!

![](https://miro.medium.com/v2/resize:fit:1400/0*_jaE9Y5ugAi1TfSS)

These two very visible and important improvements are the direct result of React 18’s automatic batching and concurrency features. This gave us a very clear and positive indication that we were moving in the right direction.

The integration of React 18 has already resulted in significant improvements for us, opening the door to a wealth of previously unavailable possibilities. We are now focused on exploring the potential benefits of new features such as [startTransition](https://react.dev/reference/react/startTransition) and [React Server Components](https://react.dev/reference/rsc/server-components). Our core intention is to continuously bring our INP scores down and improve overall functionality. However, we’re mindful of questions we still need to answer about these enhancements. For now, our primary commitment is ensuring the stable and reliable performance of the current React version we use.

Based on our results on the news site, we felt confident to pursue upgrades for some of our other sites, where we saw similar performance gains. We were able to get our INP scores out of the “poor” zone before [Google’s March deadline](https://developers.google.com/search/blog/2023/05/introducing-inp), and saw no negative SEO results when it became part of their search algorithm. We like to think that our readers are enjoying the slightly-snappier experience. And our newsroom continues to put out [powerful](https://www.nytimes.com/2024/03/24/world/asia/india-sugar-cane-fields-child-labor-hysterectomies.html) and [interesting](https://www.nytimes.com/2024/05/02/arts/music/song-copyright-sheet-music-ed-sheeran-marvin-gaye.html) interactives every day, without having to give their rendering framework a second thought.

_Ilya Gurevich is a Senior Software Engineer with over 10 years of experience in both startup and enterprise environments. He is currently part of the core Web Platforms Team since joining the Times in 2019. He manages the centralized NodeJS platform that powers the main site, and also works on the developer experience, tooling, and build process for a multi-workspace monorepo with over a hundred active contributors. Previously, he worked on the Times’ cutting-edge real-time collaborative text editor tailored for reporters and editors._