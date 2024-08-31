> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.rob.directory](https://www.rob.directory/blog/react-from-scratch)

> A detailed explanation of the architecture I used to rebuild react

Implementing React From Scratch
===============================

Robby Pruzan 8/23/24

Estimated Reading Time: 26.2m

Full Code: [https://github.com/RobPruzan/react-scratch](https://github.com/RobPruzan/react-scratch)

Table of Contents
-----------------

*   [Rendering something to the screen](#rendering-something-to-the-screen)
*   [useState](#usestate)
*   [Re-rendering a component](#re-rendering-a-component)
*   [Reconciling view nodes between render](#reconciling-view-nodes-between-render)
*   [Conditional elements](#conditional-elements)
*   [Efficient DOM updates](#efficient-dom-updates)
*   [More hooks](#more-hooks)
    *   [useRef](#useref)
    *   [useEffect](#useeffect)
    *   [useMemo](#usememo)
    *   [useCallback](#usecallback)
    *   [useContext](#usecontext)
*   [Final result](#the-final-result)
*   [Conclusion](#conclusion)

My goal here is to walk through my process of building react from the groundup, hopefully giving you an intuition to why things behave the way they do in react. There are many cases where react leaks its abstraction in the interface, so learning how the internals **could** by implemented is extremely useful to understand the motivation behind those interface designs.

But, I'm not trying to follow the same implementation that the react team did. I didn't even know the internal architecture before coding this up. Just high level concepts like virtual dom's and reconciliation.

This is also not supposed to be an optimal implementation. There are several very impressive optimizations react implements that I will not be attempting- like concurrent/cancellable rendering.

What I want to get done here is:

*   Core render model (components in the component tree should re-render the same amount of times between implementations)
*   Output should look the same given the same input
*   Core hooks are implemented (useState, useRef, useEffect, useContext,useMemo, useCallback)
*   Precise Dom updates

Rendering something to the screen


-------------------------------------

Let's start with the first goal, rendering something to the screen, using react's api. React is traditionally written through jsx, an html like syntax for instantiating components. But, the actual library has no idea of this representation. All jsx syntax gets transformed to function calls.

For example, the following snippet:

```
<div>
  <span>hello</span>
</div>


```

<div> <span>hello</span> </div> /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } React.createElement("div", { id:"parent" }, React.createElement("span", null, "hello")) React.createElement("div", { id:"parent" }, React.createElement("span", null, "hello")) /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } const App = () => { return React.createElement("div", { innerText: "hello world" }, React.createElement("span", { innerText: "child" })) } const App = () => { return React.createElement("div", { innerText: "hello world" }, React.createElement("span", { innerText: "child" })) } /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } // what createElement will accept as input export type ReactComponentExternalMetadata<T extends AnyProps> = { component: keyof HTMLElementTagNameMap | ReactComponentFunction<T>; props: T; children: Array<ReactComponentInternalMetadata>; }; // internal representation of component metadata for easier processing export type TagComponent = { kind: "tag"; tagName: keyof HTMLElementTagNameMap; }; export type FunctionalComponent = { kind: "function"; name: string; function: ( props: Record<string, unknown> | null ) => ReactComponentInternalMetadata; }; export type ReactComponentInternalMetadata = { id: string; component: TagComponent | FunctionalComponent; props: AnyProps; children: Array<ReactComponentInternalMetadata>; }; // what createElement will accept as input export type ReactComponentExternalMetadata<T extends AnyProps> = { component: keyof HTMLElementTagNameMap | ReactComponentFunction<T>; props: T; children: Array<ReactComponentInternalMetadata>; }; // internal representation of component metadata for easier processing export type TagComponent = { kind: "tag"; tagName: keyof HTMLElementTagNameMap; }; export type FunctionalComponent = { kind: "function"; name: string; function: ( props: Record<string, unknown> | null ) => ReactComponentInternalMetadata; }; export type ReactComponentInternalMetadata = { id: string; component: TagComponent | FunctionalComponent; props: AnyProps; children: Array<ReactComponentInternalMetadata>; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } export const createElement = <T extends AnyProps>( component: ReactComponentExternalMetadata<T>["component"], props: T, ...children: Array<ReactComponentInternalMetadata> ): ReactComponentInternalMetadata => ({ component: mapComponentToTaggedUnion(externalMetadata.component), // impl left as an exercise to reader children: externalMetadata.children, props: externalMetadata.props, id: crypto.randomUUID(), }); export const createElement = <T extends AnyProps>( component: ReactComponentExternalMetadata<T>["component"], props: T, ...children: Array<ReactComponentInternalMetadata> ): ReactComponentInternalMetadata => ({ component: mapComponentToTaggedUnion(externalMetadata.component), // impl left as an exercise to reader children: externalMetadata.children, props: externalMetadata.props, id: crypto.randomUUID(), }); /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } const applyComponentsToDom = (metadata: ReactComponentInternalMetadata, parentElement: HTMLElement | null) => { if (metadata.component.kind === "tag") { const element = document.createElement(metadata.component.tagName); Object.assign(element, metadata.props); parentElement?.appendChild(element); metadata.childNodes.forEach(childNode => appendTagsToDOM(childNode, element)); } else { throw Error("Not Implemented") } } const applyComponentsToDom = (metadata: ReactComponentInternalMetadata, parentElement: HTMLElement | null) => { if (metadata.component.kind === "tag") { const element = document.createElement(metadata.component.tagName); Object.assign(element, metadata.props); parentElement?.appendChild(element); metadata.childNodes.forEach(childNode => appendTagsToDOM(childNode, element)); } else { throw Error("Not Implemented") } } /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } type ReactViewTreeNode = { id: string; childNodes: Array<ReactViewTreeNode>; metadata: ReactComponentInternalMetadata; }; type ReactViewTreeNode = { id: string; childNodes: Array<ReactViewTreeNode>; metadata: ReactComponentInternalMetadata; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } ReactDom.render(<App />, document.getElementById("root")!); ReactDom.render(<App />, document.getElementById("root")!); /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   create a new node for every internal metadata (which will be returned at the end of the function)
*   if the metadata represents a function, run the function, recursively traverse its output, and append the recursive call's result to the child nodes of the new node
    *   This gives us the fully exectuted tree under the function (at most as 1 child)
*   If the metadata represents a tag, get the view node for all the children's metadata by calling generateViewTree recursively. Set that output as the child nodes of the new node made for the tag metadata
    *   This gives us the fully executed tree under the tag node (may have many children)

What that looks like in code is:

```
const generateViewTree = ({
  internalMetadata,
}: {
  internalMetadata: ReactComponentInternalMetadata;
}): ReactViewTreeNode => {
  const newNode: ReactViewTreeNode = {
    id: crypto.randomUUID(),
    metadata: internalMetadata,
    childNodes: [],
  };

  switch (internalMetadata.component.kind) {
    case "function": {
      const outputInternalMetadata = internalMetadata.component.function({
        ...internalMetadata.props,
        children: internalMetadata.children,
      });

      const subViewTree = generateViewTree({
        internalMetadata: nextNodeToProcess,
      });

      newNode.childNodes.push(subViewTree);
      break;
    }
    case "tag": {
      newNode.childNodes = renderNode.internalMetadata.children.map(
        generateViewTree
      );
      break;
    }
  }

  return newNode;
};


```

const generateViewTree = ({ internalMetadata, }: { internalMetadata: ReactComponentInternalMetadata; }): ReactViewTreeNode => { const newNode: ReactViewTreeNode = { id: crypto.randomUUID(), metadata: internalMetadata, childNodes: [], }; switch (internalMetadata.component.kind) { case "function": { const outputInternalMetadata = internalMetadata.component.function({ ...internalMetadata.props, children: internalMetadata.children, }); const subViewTree = generateViewTree({ internalMetadata: nextNodeToProcess, }); newNode.childNodes.push(subViewTree); break; } case "tag": { newNode.childNodes = renderNode.internalMetadata.children.map( generateViewTree ); break; } } return newNode; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } const applyComponentsToDom = ( viewNode: ReactViewNode, parentElement: HTMLElement | null ) => { switch (viewNode.internalMetadata.kind) { case "tag": { const element = document.createElement( viewNode.metadata.component.tagName ); Object.assign(element, viewNode.metadata.props); parentElement?.appendChild(element); viewNode.metadata.childNodes.forEach((childNode) => appendTagsToDOM(childNode, element) ); break; } case "function": { applyComponentsToDom(viewNode.childNodes[0]); // a functional component has at most 1 child since every element must have a parent when returned } } }; const applyComponentsToDom = ( viewNode: ReactViewNode, parentElement: HTMLElement | null ) => { switch (viewNode.internalMetadata.kind) { case "tag": { const element = document.createElement( viewNode.metadata.component.tagName ); Object.assign(element, viewNode.metadata.props); parentElement?.appendChild(element); viewNode.metadata.childNodes.forEach((childNode) => appendTagsToDOM(childNode, element) ); break; } case "function": { applyComponentsToDom(viewNode.childNodes[0]); // a functional component has at most 1 child since every element must have a parent when returned } } }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   How does `useState` know which component instance it's being called from?
*   If there are multiple `useState`'s in a component, how does it remember between renders what state it's associated with?

```
const Component = () => {
  const [a, setA] = useState(0); // how does it know it was called inside of Component?
  const [b, setB] = useState("b"); // how will it know to return "b" the next render and not 0?
};


```

const Component = () => { const [a, setA] = useState(0); // how does it know it was called inside of Component? const [b, setB] = useState("b"); // how will it know to return "b" the next render and not 0? }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } useState(); useState(); useEffect(); useState(); useState(); useState(); useEffect(); useState(); /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } useState(); useState(); useEffect(); useState(); useState(); useState(); useEffect(); useState(); /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } let currentHookOrder = 0; const useState = () => { let useStateHookOrder = currentHookOrder; currentHookOrder += 1; // do some stuff }; let currentHookOrder = 0; const useState = () => { let useStateHookOrder = currentHookOrder; currentHookOrder += 1; // do some stuff }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   the value stored at the i'th position in the hook state array
*   a closure that has the ability to mutate that hook array with a provided value, and trigger a re-render of the component that defined the state (by capturing the currently rendering component in the closure)

This would look something like

```
const useState = (initialState) => {
  const currentlyRenderingComponent =
    someGlobalObject.currentlyRenderingComponent;
  const useStateHookOrder = currentHookOrder;
  currentHookOrder += 1;
  if (!currentlyRenderingComponent.hasRendered) {
    currentlyRenderingComponent.hookState.push(initialState);
  }
  const state = currentlyRenderingComponent.hookState[currentHookOrder];
  return [
    state,
    (value) => {
      currentlyRenderingComponent.hookState[useStateHookOrder] = value;
      triggerReRender(currentlyRenderingComponent); // TODO
    },
  ];
};


```

const useState = (initialState) => { const currentlyRenderingComponent = someGlobalObject.currentlyRenderingComponent; const useStateHookOrder = currentHookOrder; currentHookOrder += 1; if (!currentlyRenderingComponent.hasRendered) { currentlyRenderingComponent.hookState.push(initialState); } const state = currentlyRenderingComponent.hookState[currentHookOrder]; return [ state, (value) => { currentlyRenderingComponent.hookState[useStateHookOrder] = value; triggerReRender(currentlyRenderingComponent); // TODO }, ]; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   regenerate the view tree, starting from the captured currentlyRenderingComponent in the set state closure
*   once the sub view tree is generated, patch the existing view tree (that we store in a global object) to use the newly generated sub tree, transferring over its state to the new view tree
*   Given the new, patched, view tree, update the dom

Step 1 will not be that challenging. The `generateViewTree` function that I showed above is a pure function, and does not operate differently if it's passed the root of the tree, or a sub-tree that is part of a larger tree. So we can just pass it the captured variable in the useState returned closure- `currentlyRenderingComponent`- and get our new view tree, automatically re-rendering all the children. Because we mutated the hook state array before re-rendering the children, they will read the newest value passed to the set state function.

Now we can move onto step 2, patching the existing view tree. This is also quite simple. We just need to do a traversal of the existing view tree to find the currently rendering components parent, and then just replace the previous node with the newly generated node. To transfer over the state, we can just copy over the components state to the new tree node (this is not the right way to do it, will go over the right way later).

Then using this patched view tree, we will update the dom in a hilariously inefficient manner, and then come back and make a more efficient implementation later. We will take down the entire DOM starting from the root of our react app, and then re-build it using our new view tree. We already have a function that can apply the entire view tree to the dom given a root dom element, so we can re-use that.

Those 3 steps in the function together would look like

```
const triggerReRender = (
  capturedCurrentlyRenderingRenderNode: ReactViewTreeNode
) => {
  const newViewTree = generateViewTree(capturedCurrentlyRenderingRenderNode);
  const parentNode = findParentNode(capturedCurrentlyRenderingRenderNode);
  replaceNode({
    parent: parentNode,
    oldNode: capturedCurrentlyRenderingRenderNode,
    newNode: newViewTree,
  });
  while (globalState.roomDomNode.firstChild) {
    removeDomTree(node.firstChild);
  }

  applyComponentsToDom(newViewTree, globalState.roomDomNode);
};


```

const triggerReRender = ( capturedCurrentlyRenderingRenderNode: ReactViewTreeNode ) => { const newViewTree = generateViewTree(capturedCurrentlyRenderingRenderNode); const parentNode = findParentNode(capturedCurrentlyRenderingRenderNode); replaceNode({ parent: parentNode, oldNode: capturedCurrentlyRenderingRenderNode, newNode: newViewTree, }); while (globalState.roomDomNode.firstChild) { removeDomTree(node.firstChild); } applyComponentsToDom(newViewTree, globalState.roomDomNode); }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   components in the component tree should re-render the same amount of times between implementations

If our view tree is constructed correctly, this should be true. When a parent node changes in react, it unconditionally re-renders its children by default.

But, for the following code, what do we expect the parent-child relationship to be in terms of rendering (using JSX here for brevity):

```
const ComponentA = ({ children }) => {
  const [count, setCount] = useState(0);
  return <div>{children}</div>;
};
const ComponentB = () => {
  return <div>I'm component B</div>;
};
const App = () => {
  return (
    <ComponentA>
      <ComponentB />
    </ComponentA>
  );
};


```

const ComponentA = ({ children }) => { const [count, setCount] = useState(0); return <div>{children}</div>; }; const ComponentB = () => { return <div>I'm component B</div>; }; const App = () => { return ( <ComponentA> <ComponentB /> </ComponentA> ); }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }

Note, in my actual code on GitHub I refer to the dependency tree as the "RenderTree"

This dependency tree is more inline with how react determines to re-render components. This means we have a bug, as our implementation would re-rerender `ComponentB` when a sibling (in the dependency tree) changed, because it was a child in the view tree.

We now have 2 tree representations we need to reference to correctly re-render a component. One that determines how the DOM should look, and the other that determines when components need to re-render.

The only information we need to build this dependency tree is knowing which component a given component was called in. The component some given component was called in will be marked as the parent. This works because after you call createElement, there's no way to update the elements props:

```
const element = createElement(SomeComponent, { someProp: 2 });

return <div>{ element }</div> // no way to pass props to an already created element


```

const element = createElement(SomeComponent, { someProp: 2 }); return <div>{ element }</div> // no way to pass props to an already created element /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   Before a component is rendered, create a dependency tree node for it, and store it globally so `createElement` can access it (essentially the same as the currently rendering component talked about earlier)
*   For every `createElement` call, push a new render node, representing the component an element was created for, as a child of the globally accessible render node

> Note: This strategy is only close to what I ended up doing. I ended up implementing a more roundabout method so it would play nicely with my existing code. The general idea of what I really did was:
> 
> *   take the output internal metadata by a component (a tree like structure), and flatten it into an array
> *   If any node inside the array is already in the dependency tree, it must have been called earlier, so filter it out This works because the first return value the element is in must be the component it was created in.

Using this strategy, we can build the dependency tree we were looking for. However, since we're not using it for anything, our components still re-render incorrectly.

We will need to use this dependency tree as we traverse the lazy tree returned by a component:

![](https://www.rob.directory/_next/image?url=%2Freact-from-scratch%2Fimage-3.png&w=1080&q=75)

A simple way we can use the dependency tree is as we are generating the view tree, only re-render a component if it depends on the component that triggered the re-render (or if it's never been rendered before)

If both a component is not dependent on the node that triggered the render, and it's not the first render, we can skip rendering that component, and use the previous view tree output by that component- essentially caching the output.

If you want to see in code what this looked like, [here's the real implementation that uses this strategy](https://github.com/RobPruzan/react-scratch/blob/main/src/react/core.ts#L1077-L1140)

Reconciling view nodes between render


-----------------------------------------

Our render model is still broken. As mentioned earlier, the way we transfer state between renders is very wrong!

Previously, to make sure state is not lost between re-renders, we just copied the state over for only the component that triggered the re-render

![](https://www.rob.directory/_next/image?url=%2Freact-from-scratch%2Fimage-4.png&w=1080&q=75)

But what about every other component? They will all have re-initialized states, remembering nothing from the previous re-render.

This is a pretty hard problem. We only have the runtime representation of what the tree's"look like". We don't have a compiler that runs over the user's code that tells us which components are equal

What we have to do is determine equality between the 2 trees for every node in the tree, not just the trivial root node.

Lets see how we can do this as a human. For the following example, how would you determine equality between nodes, if you had to make a decision:

![](https://www.rob.directory/_next/image?url=%2Freact-from-scratch%2Fimage-5.png&w=1080&q=75)

I think the answer is pretty easy here: just match the nodes in the same position:

![](https://www.rob.directory/_next/image?url=%2Freact-from-scratch%2Fimage-6.png&w=1080&q=75)

And how do we programmatically define position? We can just say the path to get to the node

![](https://www.rob.directory/_next/image?url=%2Freact-from-scratch%2Fimage-7.png&w=1080&q=75)

When a node has the same index path between view trees, we can transfer over the state from the previous tree. If there's a new path we can't map (implying its a new node), we don't transfer any state over and let it initialize itself.

This is why react is so crazy about providing keys when rendering lists. If nodes re-order, it will incorrectly determine equality between nodes, and state will be assigned incorrectly to components.

If you want to see what this reconciliation process between tree's looks like in code, here's the link (note, in the [final code](https://github.com/RobPruzan/react-scratch/blob/main/src/react/core.ts#L1202-L1210) we take into account the index path AND component name):

Conditional elements
--------------------

Conditional elements are a core part of react's functionality. Because you're just writing a javascript function that returns react elements, you can of course conditionally return elements:

```
return <div> {condition ? <ComponentA /> : <ComponentB />} </div>;


```

return <div> {condition ? <ComponentA /> : <ComponentB />} </div>; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } return <div> {condition && <ComponentA />} </div>; return <div> {condition && <ComponentA />} </div>; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } return React.createElement( "div", null, condition && React.createElement(ComponentA, null) ); return React.createElement( "div", null, condition && React.createElement(ComponentA, null) ); /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } const useRef = (initialState) => { const currentlyRenderingComponent = someGlobalObject.currentlyRenderingComponent; const useRefHookOrder = currentHookOrder; currentHookOrder += 1; if (!currentlyRenderingComponent.hasRendered) { currentlyRenderingComponent.hookState.push( Object.seal({ current: initialState }) ); } const ref = currentlyRenderingComponent.hookState[useRefHookOrder]; return ref; }; const useRef = (initialState) => { const currentlyRenderingComponent = someGlobalObject.currentlyRenderingComponent; const useRefHookOrder = currentHookOrder; currentHookOrder += 1; if (!currentlyRenderingComponent.hasRendered) { currentlyRenderingComponent.hookState.push( Object.seal({ current: initialState }) ); } const ref = currentlyRenderingComponent.hookState[useRefHookOrder]; return ref; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   The effect callback
*   The effect dependencies
*   The effect cleanup

Every time the dependencies change or the component is first mounted, the effect callback is called. If the effect callback returns a function, it will be called before the next effect, acting as a cleanup function for any setup logic performed in the effect callback.

The useEffect hook is also quite simple to implement, especially because of how complex it can feel in some codebases.

We follow a similar process to useRef and useState: We read the currently rendering component, index into its hooks, and initialize it if the component hasn't already been rendered.

But we have one extra step. If the dependencies changed compared to the previous render, measured with shallow equality (===), then we update the effect callback of the hook state and its dependencies. If the dependencies change, then the previous callback has a closure over stale values, so we need the newly computed closure (remember, a closure is just a special object, and we want the latest one).

```
export const useEffect = (cb: () => void, deps: Array<unknown>) => {
  const useEffectHookOrder = currentHookOrder;
  currentHookOrder += 1;

  if (!currentlyRendering.hasRendered) {
    currentlyRendering.hooks.push({
      cb,
      deps,
      cleanup: null,
      kind: "effect"
    });
  }
  const effect = currentlyRendering.hooks[currentStateOrder];

  if (
    effect.deps.length !== deps.length ||
    !effect.deps.every((dep, index) => {
      const newDep = deps[index];
      return newDep === dep;
    })
  ) {
    effect.deps = deps;
    effect.cb = cb;
  }
};


```

export const useEffect = (cb: () => void, deps: Array<unknown>) => { const useEffectHookOrder = currentHookOrder; currentHookOrder += 1; if (!currentlyRendering.hasRendered) { currentlyRendering.hooks.push({ cb, deps, cleanup: null, kind: "effect" }); } const effect = currentlyRendering.hooks[currentStateOrder]; if ( effect.deps.length !== deps.length || !effect.deps.every((dep, index) => { const newDep = deps[index]; return newDep === dep; }) ) { effect.deps = deps; effect.cb = cb; } }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   call the effect cleanup if there is one
*   call the effect
*   if the effect returns a callback, set it as the new cleanup function in the hooks state

And this is the exact code needed to implement this:

```
const outputInternalMetadata = internalMetadata.component.function({
  ...renderNode.internalMetadata.props,
  children: internalMetadata.children,
});
const currentRenderEffects = outputInternalMetadata.hooks.filter(
  (hook) => hook.kind === "effect"
);

currentRenderEffects.forEach((effect, index) => {
  const didDepsChange = Utils.run(() => {
    if (!hasRendered) {
      return true;
    }
    const currentDeps = effect.deps;
    const previousDeps = previousRenderEffects[index];

    if (currentDeps.length !== previousDeps.length) {
      return true;
    }

    return !currentDeps.every((dep, index) => {
      const previousDep = previousDeps[index];
      return dep === previousDep;
    });
  });

  if (didDepsChange) {
    effect.cleanup?.();
    const cleanup = effect.cb();
    if (typeof cleanup === "function") {
      effect.cleanup = () => cleanup(); // typescript stuff
    }
  }
});


```

const outputInternalMetadata = internalMetadata.component.function({ ...renderNode.internalMetadata.props, children: internalMetadata.children, }); const currentRenderEffects = outputInternalMetadata.hooks.filter( (hook) => hook.kind === "effect" ); currentRenderEffects.forEach((effect, index) => { const didDepsChange = Utils.run(() => { if (!hasRendered) { return true; } const currentDeps = effect.deps; const previousDeps = previousRenderEffects[index]; if (currentDeps.length !== previousDeps.length) { return true; } return !currentDeps.every((dep, index) => { const previousDep = previousDeps[index]; return dep === previousDep; }); }); if (didDepsChange) { effect.cleanup?.(); const cleanup = effect.cb(); if (typeof cleanup === "function") { effect.cleanup = () => cleanup(); // typescript stuff } } }); /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } export const useMemo = (cb: () => void, deps: Array<unknown>) => { const useMemoHookOrder = currentHookOrder; currentHookOrder += 1; if (!currentlyRendering.hasRendered) { currentlyRendering.hooks.push({ cb, deps, cleanup: null, }); } const memo = currentlyRendering.hooks[useMemoHookOrder]; if ( memo.deps.length !== deps.length || !memo.deps.every((dep, index) => { const newDep = deps[index]; return newDep === dep; }) ) { const value = cb(); memo.value = value; return value; } return memo.value; }; export const useMemo = (cb: () => void, deps: Array<unknown>) => { const useMemoHookOrder = currentHookOrder; currentHookOrder += 1; if (!currentlyRendering.hasRendered) { currentlyRendering.hooks.push({ cb, deps, cleanup: null, }); } const memo = currentlyRendering.hooks[useMemoHookOrder]; if ( memo.deps.length !== deps.length || !memo.deps.every((dep, index) => { const newDep = deps[index]; return newDep === dep; }) ) { const value = cb(); memo.value = value; return value; } return memo.value; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } function updateMemo<T>( nextCreate: () => T, deps: Array<mixed> | void | null ): T { const hook = updateWorkInProgressHook(); const nextDeps = deps === undefined ? null : deps; const prevState = hook.memoizedState; // Assume these are defined. If they're not, areHookInputsEqual will warn. if (nextDeps !== null) { const prevDeps: Array<mixed> | null = prevState[1]; if (areHookInputsEqual(nextDeps, prevDeps)) { return prevState[0]; } } const nextValue = nextCreate(); if (shouldDoubleInvokeUserFnsInHooksDEV) { setIsStrictModeForDevtools(true); nextCreate(); setIsStrictModeForDevtools(false); } hook.memoizedState = [nextValue, nextDeps]; return nextValue; } function updateMemo<T>( nextCreate: () => T, deps: Array<mixed> | void | null ): T { const hook = updateWorkInProgressHook(); const nextDeps = deps === undefined ? null : deps; const prevState = hook.memoizedState; // Assume these are defined. If they're not, areHookInputsEqual will warn. if (nextDeps !== null) { const prevDeps: Array<mixed> | null = prevState[1]; if (areHookInputsEqual(nextDeps, prevDeps)) { return prevState[0]; } } const nextValue = nextCreate(); if (shouldDoubleInvokeUserFnsInHooksDEV) { setIsStrictModeForDevtools(true); nextCreate(); setIsStrictModeForDevtools(false); } hook.memoizedState = [nextValue, nextDeps]; return nextValue; } /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) { // $FlowFixMe[incompatible-use] found when upgrading Flow if (is(nextDeps[i], prevDeps[i])) { continue; } return false; } return true; for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) { // $FlowFixMe[incompatible-use] found when upgrading Flow if (is(nextDeps[i], prevDeps[i])) { continue; } return false; } return true; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } export const useCallback = <T,>( fn: () => T, deps: Array<unknown> ): (() => T) => { return useMemo(() => fn, deps); }; export const useCallback = <T,>( fn: () => T, deps: Array<unknown> ): (() => T) => { return useMemo(() => fn, deps); }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } useMemo(() => () => { }, []) useMemo(() => () => { }, []) /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } not being responsible for creating any state when called. It's only responsible for reading state, which is being shared higher up the tree.

The functionality required to share this state is not part of the hook. It originates through a context provider- a special component.

Here's an example usage to make sure we're on the same page

```
const CountContext = createContext({ count: 0 });

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={{ count }}> the special component, made by createContext
      <Child />
    </CountContext.Provider>
  );
};

const Child = () => {
  const { count } = useContext(CountContext);
  return <div> {count} </div>;
};


```

const CountContext = createContext({ count: 0 }); const App = () => { const [count, setCount] = useState(0); return ( <CountContext.Provider value={{ count }}> the special component, made by createContext <Child /> </CountContext.Provider> ); }; const Child = () => { const { count } = useContext(CountContext); return <div> {count} </div>; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } return ( <div> <SomeContext.Provider> <SomeComponent/> </SomeContext.Provider> <OtherComponent/> </div> ) return ( <div> <SomeContext.Provider> <SomeComponent/> </SomeContext.Provider> <OtherComponent/> </div> ) /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } For a provider component, we can assign the data we want to distribute to the decedents of the component by adding a property on the internal metadata that stores it. Then, we set it only when we create the metadata using `createContext`.

Later, when we call `useContext(SomeContext)`, we read up the view tree and look for a node that has a provider equal to SomeContext.Provider, and if it does the data will be available to read.

Here's what the implementation of createContext looks like:

```
export const createContext = <T,>(initialValue: T) => {
  const contextId = crypto.randomUUID();

  currentTreeRef.defaultContextState.push({
    contextId,
    state: initialValue,
  }); // explained later
  return {
    Provider: (data: {
      value: T;
      children: Array<
        ReactComponentInternalMetadata | null | false | undefined
      >;
    }) => {
      if (
        typeof data.value === "object" &&
        data.value &&
        "__internal-context" in data.value
      ) {
        // hack to associate an id with a provider, allowing us to determine if ProviderA === ProviderB. We could of used the function reference, but this was easier for debugging
        return contextId as unknown as ReturnType<typeof createElement>;
      }
      const el = createElement("div", null, ...data.children); // for i have sinned, ideally would of used a fragment
      if (!(el.kind === "real-element")) {
        throw new Error();
      }
      el.provider = {
        state: data.value, // the data that will be read by useContext
        contextId,
      };
      return el;
    },
  };
};


```

export const createContext = <T,>(initialValue: T) => { const contextId = crypto.randomUUID(); currentTreeRef.defaultContextState.push({ contextId, state: initialValue, }); // explained later return { Provider: (data: { value: T; children: Array< ReactComponentInternalMetadata | null | false | undefined >; }) => { if ( typeof data.value === "object" && data.value && "__internal-context" in data.value ) { // hack to associate an id with a provider, allowing us to determine if ProviderA === ProviderB. We could of used the function reference, but this was easier for debugging return contextId as unknown as ReturnType<typeof createElement>; } const el = createElement("div", null, ...data.children); // for i have sinned, ideally would of used a fragment if (!(el.kind === "real-element")) { throw new Error(); } el.provider = { state: data.value, // the data that will be read by useContext contextId, }; return el; }, }; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   Note that the element type i passed was a div. This is obviously wrong. What we really want to do here is something like a fragment. For now I wont implement it because I don't think it's a core feature of react.
*   Note, previously, our view tree nodes only carry information about their child nodes. So, we would have to do a potentially expensive traversal to move up the tree and check if an ancestor node has the provider we are looking for. To avoid this, I ended up performing a minor optimization and de-normalizing the view tree by storing the parent as a property on the child node.

If we don't find the provider up the tree, we want to return the default value passed to createContext. This was the unexplained part about the above `createContext` implementation. What we can do is store the default values in a global array. When a provider is not found, the `useContext` function can fall back to reading the default values. This behavior is very similar to how programming languages behave when a value is not found in any ancestor scope- fallback to looking into the global scope.

Lets now look at what the `useContext` implementation would look like since all the pieces needed are finished:

```
export const useContext = <T,>(
  context: ReturnType<typeof createContext<T>>
) => {
  const providerId = context.Provider({
    value: {
      "__internal-context": true,
    },
  } as any) as unknown as string;
  const state = searchForContextStateUpwards(
    currentlyRenderingComponent,
    providerId
  );
  return state as T;
};


```

export const useContext = <T,>( context: ReturnType<typeof createContext<T>> ) => { const providerId = context.Provider({ value: { "__internal-context": true, }, } as any) as unknown as string; const state = searchForContextStateUpwards( currentlyRenderingComponent, providerId ); return state as T; }; /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } } const testContext = createContext(0) export const ContentNavbar = () => { if (Math.random() > .5) { console.log("Being called conditionally!", useContext(testContext)); } return <div>this works!</div> } const testContext = createContext(0) export const ContentNavbar = () => { if (Math.random() > .5) { console.log("Being called conditionally!", useContext(testContext)); } return <div>this works!</div> } /** * Reset the text fill color so that placeholder is visible */ .npm__react-simple-code-editor__textarea:empty {-webkit-text-fill-color: inherit !important;} /** * Hack to apply on some CSS on IE10 and IE11 */ @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { /** * IE doesn't support'-webkit-text-fill-color'* So we use'color: transparent' to make the text transparent on IE * Unlike other browsers, it doesn't affect caret color in IE */ .npm__react-simple-code-editor__textarea { color: transparent !important; } .npm__react-simple-code-editor__textarea::selection { background-color: #accef7 !important; color: transparent !important; } }*   implementing server-side rendering
    
    *   this would involve building a string, instead of a dom, from the view tree
    *   We would have to find a way to map the HTML generated by the server to the view/dependency trees generated by the client side react. This would formally be known as hydration.
*   different render targets
    
    *   there's no reason we have to generate a dom from our view tree. Any UI that has any hierarchial structure can pretty easily use the implemented react internals here
*   reimplement this in swift
    
    *   i've had to use UIKit recently for a job, and very much miss react. Something inside me very much wants to port this to swift.
    *   Instead of dom elements the library would create UIViews

Hopefully, you got something out of reading this. If you're interested in more stuff about react internals, and this article made somewhat sense to you, I recommend going ahead and just reading the [react source code](https://github.com/facebook/react[.](https://github.com/facebook/react)). No better place to learn more about react than react itself