---
title: The React Ecosystem in 2023.
date: 2023-07-04 13:51:27
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.builder.io](https://www.builder.io/blog/react-js-in-2023)

> Drag and drop with your components, right within your existing site or app. Build and optimize digita......

As React celebrates its 10th anniversary in 2023, the ecosystem continues to flourish with constant advancements and innovations. As one of the most widely-used JavaScript libraries, React remains a favorite among developers for building dynamic and high-performance applications.

However, with a vast array of tools and libraries available within the React ecosystem, choosing the right combination for your project can be challenging. In this article, we'll explore the most essential libraries that are widely used and trusted by developers, and help you make informed decisions on the right tools to use for your next React project.

For those who are new to React, getting started can be a daunting task. There are a few different ways to get started which can be confusing.

If you're new to React, or if you just want to play around with it without setting up a project, you can use online sandboxes like [CodeSandbox](https://codesandbox.io/) or [StackBlitz](https://stackblitz.com/). These sandboxes provide a virtual environment where you can write and test your React code without having to install anything on your computer.

Online sandboxes aside, a popular choice is [Vite](https://vitejs.dev/), which is a build tool that provides a fast and easy development experience for modern web projects. Vite supports React out-of-the-box, which means that you can quickly set up a React project without having to configure the build process manually. Run the below command and follow the prompts!

Another popular choice for getting started with React is [Next.js](https://nextjs.org/), which is a framework built on top of React. Next.js provides a robust set of features, including automatic code splitting, server-side rendering, static site generation, and more. Next.js is great for building complex applications that require server-side rendering and SEO optimization. The easiest way to get started with Next.js is by using `create-next-app`. It is a CLI tool that enables you to quickly start building a new Next.js application, with everything set up for you.

```
npx create-next-app@latest

```

Online sandboxes to test the waters

**Vite** for small to medium projects

**Next.js** for projects that require SSR and SEO optimization

Routing is an essential part of any modern web application, and there are many excellent routing libraries available to handle complex routing logic and create dynamic, single-page applications (SPAs).

One of the most popular routing libraries for React is [React Router](https://reactrouter.com/en/main). React Router provides a straightforward and declarative way to handle routing in your React application, so you can define routes and render different components based on the current URL.

Here's a sample code snippet to set up the root route and an `/about` route, each rendering different content:

```
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);


```

A new kid on the block is [TanStack Router](https://tanstack.com/router/v1). It is feature rich and lightweight but has relatively smaller usage compared to React Router. If you come across a specific feature that is present only in TanStack Router, you might want to give this a try. Here’s a [comparison table](https://tanstack.com/router/v1/docs/comparison) to help you make that decision.

**React Router** for SPAs built without a framework router

**************Next.js************** if you need a full framework router that includes SSR and/or SSG

As your application grows, it helps to be more intentional about how your state is organized and how the data flows between your components. State management libraries make it easier to manage complex application state and keep your UI in sync with your data.

A popular state management library for React is [Redux Toolkit](https://redux-toolkit.js.org/). Redux Toolkit is a set of tools and best practices for efficiently managing state. It provides a simplified API for defining and updating state, as well as built-in support for features such as immutable updates, serializable action types, and more.

Redux Toolkit also includes a number of additional features, such as a built-in Thunk middleware for handling asynchronous logic, and a DevTools extension for debugging your Redux state.

Here’s a code snippet of a redux slice which is a collection of redux logic and actions for a single feature in your app:

```
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer

```

[Zustand](https://zustand-demo.pmnd.rs/) is another state management library for React that provides a clear and lightweight solution for managing state in your application. Zustand provides a built-in mechanism for subscribing to state changes, so you can easily keep your UI in sync with your data.

It is a great choice for developers who want a lightweight and easy-to-use state management solution without the overhead of a larger library like Redux.

Here is a code snippet for a simple increment counter using Zustand:

```
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

function Counter() {
  const { count, inc } = useStore()

  return (
    <div>
      <span>{count}</span>
      <button onClick={inc}>one up</button>
    </div>
  )
}


```

**Redux Toolkit** for a more fully-featured solution with a larger API and built-in support for additional features.

**Zustand** for a lightweight and simple solution that is easy to use and doesn't require as much boilerplate code.

Server state management refers to the management of data that is stored on the server and is accessed remotely by the client application. This data can include user authentication details, database records, and other backend data. To manage server state in React applications, there are several libraries available.

The most popular one is [TanStack Query](https://tanstack.com/query/latest) which provides an intuitive and powerful way to manage server state in React applications. It provides a caching layer that automatically manages the state of your data, fetching and updating it as needed.

The library also provides a number of built-in features, such as automatic re-fetching, polling, and pagination, making it easy to work with complex data sets.

Here’s a sample code snippet of querying an API and working with the returned response in a function component:

```
function GitHubStats() {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axios
        .get("https://api.github.com/repos/gopinav/react-query-tutorials")
        .then((res) => res.data),
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? "Updating..." : ""}</div>
    </div>
  );
}


```

[SWR](https://swr.vercel.app/) is another popular library for managing server state in React applications. The name “SWR” comes from `stale-while-revalidate`, a cache invalidation strategy popularized by [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861). Compared to TanStack Query, SWR does have some feature limitations.

If you’re using Redux Toolkit for client state management, [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) is a great choice for seamlessly managing server state.

[Apollo Client](https://www.apollographql.com/docs/react/) is another popular library for managing server state in React applications. It is particularly well-suited for working with GraphQL APIs.

**Tanstack Query** for REST APIs

**Apollo Client** for GraphQL

Handling forms can be a tedious and error-prone task, but there are now many excellent form-handling libraries available for React. Some of the most popular options include [Formik](https://formik.org/) and [React Hook Form](https://react-hook-form.com/). These libraries make it easier to handle form validation, submission, and error handling.

While Formik provides an intuitive API for managing form state, validating inputs, and submitting data the library is not actively maintained.

React Hook Form should be your go-to library for handling forms in 2023. It is lightweight, fast, and straightforward to use. React Hook Form utilizes the power of React hooks to manage form state and validation rules. It also provides a flexible API for building forms and allows you to easily integrate with other libraries such as [Yup](https://github.com/jquense/yup) and [Zod](https://zod.dev/) for validation.

Unlike Formik, React Hook Form does not require a lot of boilerplate code and can significantly reduce the amount of code needed to handle form data. Additionally, React Hook Form has excellent performance as the component does not re-render for every change in the field value.

Here’s a sample code snippet for a react hook form that accepts a user’s first and last names:

```
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input {...register("firstName")} />

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("lastName", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.lastName && <span>This field is required</span>}

      <button>Submit</button>
    </form>
  );
}


```

**React Hook Form** with Yup/Zod for performant, flexible and extensible forms with easy-to-use validation.

Testing is an essential part of building high-quality React applications. When it comes to testing React applications, two excellent options to consider are [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit testing and [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/) for end-to-end testing.

Vitest is a blazing-fast unit test framework powered by Vite. In the context of testing React apps, it is a test runner that finds tests, runs the tests, determines whether the tests passed or failed, and reports it back in a human-readable manner.

React testing library is a javascript testing utility that provides virtual DOM for testing React components. With the automated tests, there is no actual DOM to work with. React Testing Library provides a virtual DOM which we can use to interact with and verify the behavior of a react component.

Playwright and Cypress are libraries that provide a reliable and robust way to test your React application's functionality from end to end. You can write tests that simulate real-world user interactions with your application, including clicks, keyboard input, and form submissions. They also have excellent documentation and an active community.

**Vitest + React Testing** **Library** for Unit Testing the way your software is used

**Playwright or Cypress** for end to end testing

Styling is an essential aspect of building modern web applications. With so many styling libraries available for React, it can be overwhelming to choose the right one for your project. Here are some popular styling libraries that can help you create beautiful and responsive user interfaces.

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework that provides a set of pre-defined classes for building UI components. With Tailwind CSS, you can quickly create complex layouts and custom styles without writing CSS from scratch. It has excellent documentation and an active community, making it a top choice for developers looking to create modern, responsive UIs.

```
<button>
  Button
</button>


```

[Styled Components](https://styled-components.com/) is a popular library for styling React components using CSS-in-JS. It allows you to write CSS directly in your JavaScript code, making it easy to create dynamic styles that are scoped to individual components. Styled Components also has excellent support for theming, allowing you quickly switch between different styles for your application.

```
import styled from 'styled-components';

const Button = styled.button`
  background-color: #3f51b5;
  color: #fff;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #303f9f;
  }
`;

export default Button;

```

[Emotion](https://emotion.sh/docs/introduction) is another CSS-in-JS library that provides a powerful API for styling React components. It is highly performant and allows you to define styles using a wide range of syntaxes, including CSS, Sass, and Less.

```
import { css } from '@emotion/react';

const buttonStyles = css`
  background-color: #3f51b5;
  color: #fff;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #303f9f;
  }
`;

const Button = () => (
  <button css={buttonStyles}>
    Button
  </button>
);

export default Button;

```

[CSS Modules](https://github.com/css-modules/css-modules) is a popular approach to styling in React that allows you to write modular CSS code that is scoped to individual components. With CSS Modules, you can write CSS classes that are only applied to specific components, preventing naming collisions and ensuring that styles are properly encapsulated.

In the CSS Modules approach, you would need to create a separate CSS file — for example, `Button.module.css` — with the following content:

```
import styles from './Button.module.css';

const Button = () => (
  <button className={styles.button}>
    Button
  </button>
);

export default Button;

```

```
.button {
  background-color: #3f51b5;
  color: #fff;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #303f9f;
}


```

Started by Mark Dalgleish, co-creator of CSS Modules, [Vanilla Extract](https://vanilla-extract.style/) is one of the latest CSS-in-JS libraries to gain traction. It offers a lightweight, zero-runtime solution for styling React components with full TypeScript support. It provides static CSS generation at build time, resulting in improved performance and reduced bundle size. If you prefer a TypeScript-first approach and value performance, Vanilla Extract can be a great choice for styling your React applications.

```
import { style } from '@vanilla-extract/css';

// Define styles
const buttonStyles = style({
  backgroundColor: '#3f51b5',
  color: '#fff',
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#303f9f',
  },
});

const Button = () => (
  <button className={buttonStyles}>
    Button
  </button>
);

export default Button;

```

UI component libraries can be a huge time-saver for React developers, and there are now many excellent options available. Some of the most popular options include:

*   [Material UI](https://mui.com/)
*   [Mantine UI](https://ui.mantine.dev/)
*   [Ant Design](https://ant.design/)
*   [Chakra UI](https://chakra-ui.com/)

There are also Tailwind CSS frameworks such as:

*   [ShadCN](https://ui.shadcn.com/)
*   [Daisy UI](https://daisyui.com/)
*   [Headless UI](https://headlessui.com/)

**Material UI** for the large community and a great Figma kit

**Mantine UI** which is a rising star

**ShadCN** for Tailwind CSS

Animation can be a powerful tool for creating engaging and interactive user interfaces, and there are many excellent animation libraries available for React. Some of the most popular options include [React Spring](https://www.react-spring.dev/) and [Framer Motion](https://www.framer.com/motion/). These libraries make it easy to create smooth and responsive animations with minimal code.

Here’s a sample code snippet that uses Framer Motion. The core of Motion is [the motion component](https://www.framer.com/docs/component/). Think of it as a plain HTML or SVG element, supercharged with animation capabilities. Animating a **`motion`** component is as straightforward as setting values on [the animate prop](https://www.framer.com/docs/animation/).

```
import { motion } from "framer-motion";

export default function App() {
  return (
    <motion.div
      class
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}


```

**Framer Motion** provides well thought-out APIs for creating powerful animations.

Data visualization is an important part of many React applications, especially those that rely on complex data sets. Some popular data visualization libraries for React include:

*   [Victory](https://formidable.com/open-source/victory/)
*   [React Chartjs](https://react-chartjs-2.js.org/)
*   [Recharts](https://recharts.org/en-US).

These libraries minimize the learning curve of creating beautiful and interactive visualizations that can help users understand complex data.

Here's an example code snippet that uses Recharts to render a line chart:

```
import { LineChart, Line } from 'recharts';
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];

const renderLineChart = (
  <LineChart width={400} height={400} data={data}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  </LineChart>
);


```

**Recharts** is a great library for getting started with a plethora of possible visualizations.

Tables can be a challenging component to implement in React, but there are many excellent table libraries available. Some popular options include:

*   [TanStack Table](https://tanstack.com/table/v8)
*   [React Data Grid](https://github.com/adazzle/react-data-grid).

These libraries make it easy to create powerful and customizable tables with features like sorting, filtering, and pagination.

**TanStack Table** has been the go-to choice for a few years now

To reduce the need to update and deploy code just to make content updates to your site or app, you’ll want to use a headless CMS.

We recommend using [Builder.io](https://www.builder.io/) with React, as it expands past structured data editing and allows [visual editing](https://www.builder.io/blog/visual-editing-cms) with your components directly, which can significantly reduce the need to hard code content-heavy parts of your site or app.

Here is an example of what the integration looks like:

```
import { Builder, BuilderComponent, builder } from '@builder.io/react'

// Dynamically render compositions of your components
// https://www.builder.io/c/docs/quickstart
export default function MyPage({ builderJson }) {
  return <>
    <Header />
    <BuilderComponent model="page" content={builderJson} />
    <Footer />
  </>
}

// Fetch Builder.io content from the content API
// https://www.builder.io/c/docs/content-api
export async function getStaticProps({ params }) {
  // Query content from the CMS https://www.builder.io/c/docs/querying
  const content = await builder.get('page', { url: '/' }).promise()
  return { props: { builderJson: content || null } }
}

// Register your components for user in the visual editor
// // https://www.builder.io/c/docs/custom-components-setup
Builder.registerComponent(MyHeadingComponent, {
  name: 'Heading',
  // Define which props are editable
  inputs: [{ name: 'text', type: 'string', defaultValue: 'Hello world' }]
})


```

And what the editing UI is like:

Internationalization (i18n) is an important consideration for many applications, especially those with a global audience. Libraries like [i18next](https://react.i18next.com/) and [React-Intl](https://formatjs.io/docs/react-intl/) help translate your application into multiple languages and handle localization.

Our recommendations include:

*   [i18next](https://react.i18next.com/)
*   [React-Intl](https://formatjs.io/docs/react-intl/)

Type checking can help catch bugs and improve the reliability of your React applications. [TypeScript](https://www.typescriptlang.org/) is your pick for that.

Creating a streamlined and efficient development environment is important for React developers. Checkout [Storybook](https://storybook.js.org/).

Documentation is an essential part of any software project. For creating documentation apps, a really good choice is [Docusaurus](https://docusaurus.io/). Of course, you can also use Next.js with a library like [Nextra](https://nextra.site/).

[React Native](https://reactnative.dev/) has become an increasingly popular option for building native mobile applications with React. React Native allows developers to create cross-platform mobile applications using React and native components.

In addition to the libraries and tools listed above, there are many other awesome libraries available for React developers. Some popular options include:

*   [**dnd kit**](https://dndkit.com/) for drag-and-drop functionality
*   [**react-slick**](https://react-slick.neostack.com/) for building carousels and sliders
*   [**react-dropzone**](https://react-dropzone.js.org/) for file uploads.

These libraries can help streamline development and improve the user experience of your React applications.

The React ecosystem continues to evolve and grow at a rapid pace in 2023, with many excellent tools and libraries available for building high-quality React applications. Whether you're just getting started with React or you're a seasoned React developer, there are many options available to help you stay productive and build great user experiences.

Ship content with fewer tickets

```
// Dynamically render your components
export function MyPage({ json }) {
  return <BuilderComponent content={json} />
}

registerComponents([MyHero, MyProducts])


```

![](https://cdn.builder.io/api/v1/pixel?apiKey=YJIGb4i01jvw0SRdL5Bt)

![](https://cdn.builder.io/api/v1/pixel?apiKey=YJIGb4i01jvw0SRdL5Bt)

![](https://cdn.builder.io/api/v1/pixel?apiKey=YJIGb4i01jvw0SRdL5Bt)
