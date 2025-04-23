# 🧩 ComposifyJS (v0.0.4)

> A lightweight JavaScript framework—built with TypeScript and fully type-safe—that brings structure, state, and simplicity to DOM-based components through composable hooks, intuitive plugins, and direct DOM control.

### ⚠️ Heads up!

This framework is under active development on a need-to-have basis for usage in various projects under the Parhelion Consulting, LLC umbrella. Stability is not yet guaranteed (although I do not publish unstable code typically) so use at your own risk until this reaches stable release.

## 📦 Summary

ComposifyJS is a modular, vanilla JavaScript framework built for structured, maintainable DOM interactions. At its foundation is the `TComponent` pattern—a flexible, TypeScript-first design that standardizes how components are defined and extended. While most users won’t need the core component definitions directly, they provide the scaffolding for more specialized patterns like `TElementComponent`, which offers a clean way to build lifecycle-aware, DOM-bound components.

To power interactivity and dynamic behavior, ComposifyJS includes a suite of hooks—like `useElement` for safe DOM creation and `useState`, a powerful state management hook supporting private, protected, and public state layers with persistence and update listeners. Utility helpers and plugins—such as `getElementCoords`, and interactive behaviors like `makeMovable`, `makeResizable`, `makeMaximizable`, and `makeStackable` (and more soon!)—offer intuitive composition tools to build rich, responsive interfaces.

More examples and advanced usage can be found in the `examples/` folder of the GitHub repository.

<br/>

## 🧠 Core Philosophy

- **No VDOM** – Direct DOM manipulation, simplified.
- **Hook-based architecture** – Inspired by React, but native and lean.
- **Stateful by design** – Built-in useState with public/private/protected state and localStorage sync.
- **Garbage-collectable logic** – Run-once components follow standard JavaScript execution. Only logic tied to returned values, state, or events is retained—everything else is automatically discarded.
- **Framework + Library** – Use it piecemeal (utils, plugins, hooks) or as a full composable framework.

<br/>

## 🔧 Installation

Via NPM:

```
npm install composifyjs
```

Or via CDN:

```
<script src="https://cdn.jsdelivr.net/npm/composifyjs@0.0.4/dist/index.umd.min.js"></script>
```

<br/>

## 📁 Project Structure (Suggested)

```
src/
  components/
    App/
      index.ts
    Layout/
      Header/
        index.ts
      index.ts
    UI/
      Button/
        index.ts
      index.ts
  main.ts
```

This isn't enforced—ComposifyJS works wherever JS does.

<br/>

<br/>

<br/>

# Documentation

# 🧱 Components (Low-Level)

### ⚠️ Heads up!

This is a low-level abstraction that you’ll probably never need to interact with directly—unless you’re building deeply custom logic or internal tooling.
That said, all ComposifyJS Element Components are built on top of this core structure, so understanding it can be helpful if you're curious about how things work under the hood or want to extend ComposifyJS in unconventional ways.

## 🧬 Anatomy of a Component

```
export interface IBaseComponentProps {
  id?: string;
}

export interface IBaseComponentReturn<TDestructor = () => void> {
  destructor?: TDestructor;
  id: string;
}

export type TComponent<
  TProps = unknown,
  TReturn = unknown,
  TDestructor = () => void
> = (
  props: IBaseComponentProps & TProps
) => IBaseComponentReturn<TDestructor> & TReturn;
```

### 📦 Component Inputs

Every component accepts an input object which:

- Always includes an optional `id` field
- Can be extended using the `TProps` generic

#### 🧪 Example

```
type MyComponentProps = {
  name: string;
};

const MyComponent: TComponent<MyComponentProps> = ({ name, id }) => {
  console.log(name, id); // both are available

  return {
    id: id ?? 'my-default-id',
  };
};
```

### 📤 Component Outputs

Every component returns:

- A required `id`
- An optional `destructor` (called when cleaning up resources)
- Anything else you define via the `TReturn` generic

#### 🧪 Example

```
type MyReturn = {
  sayHello: () => void;
};

const MyComponent: TComponent<{ name: string }, MyReturn> = ({ name, id }) => {
  const sayHello = () => console.log(`Hello, ${name}!`);

  return {
    id: id ?? 'say-hello',
    sayHello,
  };
};
```

### 🔥 Destructor Support

If your component manages lifecycle-sensitive logic (like timers, listeners, or plugins), you can optionally include a `destructor` function.

#### 🧪 Example

```
const TimedComponent: TComponent<{}, {}, () => void> = ({ id }) => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return {
    id: id ?? 'timed',
    destructor: () => clearInterval(timer),
  };
};
```

### 🧪 When to Use This

This model is most useful when:

- Building shared logic that isn't directly tied to a DOM element
- Wrapping native JS or 3rd-party APIs with a lifecycle-aware pattern
- Abstracting reusable, standalone features that compose into higher-level components

<br />

# 🧱 ElementComponent

The `ElementComponent` type is the heart of ComposifyJS. While the base `Component` model defines the flexible foundation for composable logic, `ElementComponent` brings that structure into the **DOM** world.

Any ComposifyJS component that interacts with the DOM should use this structure—it ensures consistent patterns around element access, destruction, and extendable return behavior.

## 🧬 Anatomy of a ElementComponent

```
export interface IElementComponentProps extends IBaseComponentProps {
  parentId?: string;
}

export interface IElementComponentReturn<TDestructor = () => void>
  extends Omit<IBaseComponentReturn, 'destructor'> {
  destructor: TDestructor;
  element: HTMLElement;
}

export type TElementComponent<
  TProps = unknown,
  TReturn = unknown,
  TDestructor = () => void
> = TComponent<
  IElementComponentProps & TProps,
  IElementComponentReturn<TDestructor> & TReturn,
  TDestructor
>;
```

### 🧩 Key Concepts

- `id`: An optional unique identifier that can be used to track the component or generate DOM IDs.
- `parentId`: Optionally passed to help determine where the element should be appended or how it's grouped within a component tree.
- `element`: The actual `HTMLElement` this component is responsible for creating/managing.
- `destructor`: A function responsible for cleaning up when this component is removed or replaced.
- **Extendable Props and Returns**: Just like the base component type, `ElementComponent` supports fully generic inputs/outputs, allowing you to define custom props and return values while keeping lifecycle and structural consistency.

### ✅ When to Use This

Use this structure when you're:

- Creating reusable, DOM-based components with clean lifecycles.
- Building plugins or utilities that should interoperate with ComposifyJS components.
- Wanting your component to interoperate with hooks like `useElement()`..

#### 🧪 Example

```
import { TElementComponent, useElement, useComponentId } from 'composifyjs';

interface ISimpleComponentProps {
  text: string;
}

const SimpleComponent: TElementComponent<ISimpleComponentProps> = ({ text, id, parentId }) => {
  const { id: componentId } = useComponentId(id);

  // Use the useElement hook to
  // create and manage the element
  const { element, destructor } = useElement({
     id: componentId, parentId });

  // Initially set the textcontent of the element
  element.textContent = text;

  // Optional **
  // A simple cleanup function that will be
  // automatically invoked by the destructor
  const safeDestructor = () => {
    // Any additional cleanup can go here
    destructor?.();
  };

  return {
    id: componentId,
    element,
    destructor: safeDestructor,
  };
};

export default SimpleComponent;
```

#### 🔍 What's Happening in This Example?

- Element Creation via `useElement`: The `useElement` hook is used to create a div element and manage its lifecycle. This removes the need to manually create the element and ensures it is properly cleaned up when the component is destroyed.
- Setting Content: We set the `textContent` of the div element based on the text prop. The element returned by useElement is a vanilla **DOM** Element.
- Component Lifecycle: We define a `safeDestructor` function, which calls the destructor returned by the `useElement` hook to clean up the element when the component is destroyed. You would place other destructor calls here as well such as those returned by plugins, or useState (events), or **DOM** events attached to the element via `addEventListener`...
- ID Management: The component's ID is generated using the `useComponentId` hook if not provided via props and applied to the element.

<br />

## 🪝 Hooks

<br/>

## `useElement`

Creates and optionally appends a DOM element with configurable classes, styles, and namespace. Returns a reference to the element and a set of utility methods for class manipulation and cleanup.

### 📦 Import

```
import { useElement } from 'composifyjs';
```

### 🧾 Syntax

```
const {
  element,
  addClass,
  removeClass,
  hasClass,
  destructor?,       // Only if element was created by this hook
  unsafeDestructor?, // Only if element already existed in DOM
} = useElement(options);
```

### ⚙️ Parameters

`useElement(options: IUseElementProps)`

| Option          | Type                           | Required | Description                                                     |
| --------------- | ------------------------------ | -------- | --------------------------------------------------------------- |
| id              | string                         | ✅       | The DOM id of the element to create or retrieve.                |
| htmlElementType | string                         | ❌       | Type of HTML element to create (default: 'div').                |
| classes         | TElementClasses                | ❌       | Class or array of classes to apply to the element.              |
| namespace       | boolean or string              | ❌       | Adds a prefix or isolation to the element ID.                   |
| parentId        | string                         | ❌       | ID of the parent element to append to (default: document.body). |
| styles          | Record<string, string or null> | ❌       | Inline styles to apply to the element.                          |

### 🔁 Returns

| Property         | Type                               | Description                                                       |
| ---------------- | ---------------------------------- | ----------------------------------------------------------------- |
| element          | HTMLElement                        | The DOM element (created or retrieved).                           |
| addClass         | (classes: TElementClasses) => void | Adds class(es) to the element.                                    |
| removeClass      | (classes: TElementClasses) => void | Removes class(es) from the element.                               |
| hasClass         | (classes: TElementClasses) => void | Checks if the element has the specified class(es).                |
| destructor       | () => void (optional)              | Safely removes the element only if it was created by this hook.   |
| unsafeDestructor | () => void (optional)              | Removes the element even if it was pre-existing—use with caution. |

### 🧪 Example

```
const {
  element,
  addClass,
  removeClass,
  destructor,
} = useElement({
  id: 'my-box',
  htmlElementType: 'section',
  classes: ['box', 'rounded'],
  styles: {
    width: '200px',
    height: '200px',
    backgroundColor: 'tomato',
  },
});

// Later, dynamically add a class
addClass('highlight');

// Cleanup when done (optional)
destructor?.();
```

<br/>

## `useComponentId`

Generates a unique, consistent ID for a component or DOM element. Useful for ensuring ID stability across renders or when creating elements programmatically.

### 📦 Import

```
import { useComponentId } from 'composifyjs';
```

### 🧾 Syntax

```
const { id } = useComponentId(optionalId?, options?);
```

### ⚙️ Parameters

`useComponentId(id?: string, options?: IGetHashOptions)`

| Property | Type   | Description                                                   |
| -------- | ------ | ------------------------------------------------------------- |
| id       | string | The resulting ID, either the provided id or a generated hash. |

### 🔍 Use Case

Use this hook to generate or reuse an ID for components that need stable DOM references, especially when working with dynamic or scoped elements.

### 🧪 Example: Composing with `useComponentId` and `useElement`

When building components that need scoped DOM elements, `useComponentId` ensures each instance has a stable, optionally namespaced ID. This plays nicely with `useElement` and other hooks.

```
const MyComponent: TElementComponent = ({ id, parentId }) => {
  const { id: componentId } = useComponentId(id); // Stable or generated ID

  const { element, destructor } = useElement({
    id: componentId,
    parentId,
    classes: ['my-component'],
  });

  const { destructor: childDestructor } = ChildComponent({
    parentId: componentId,
  });

  const safeDestructor = () => {
    childDestructor?.();
    destructor?.();
  };

  return {
    id: componentId,
    element,
    destructor: safeDestructor,
  };
};

export default MyComponent;
```

### ✅ Benefits

- Guarantees unique and predictable IDs when none are passed.
- Plays well with hooks like `useElement`, `useState`, and plugins that rely on consistent DOM targeting.
- Helps with cleanup by organizing destruction flows around a known root ID.

<br/>

## `useState`

A flexible state management hook for DOM-based components (or wherever you wish), supporting three access modes: `private`, `protected`, and `public`. Each access mode governs how state is scoped, shared, and persisted.

### 📦 Import

```
import { useState } from 'composifyjs';
```

### 🧾 Syntax

```
const state = useState<type?>({
  key,
  access,
  initialState,
  onUpdate,
  persist,
});
```

### ⚙️ Parameters

`useState<TState>(args: IUseStateArgs<TState>)`

| Parameter    | Type                       | Required             | Description                                                       |
| ------------ | -------------------------- | -------------------- | ----------------------------------------------------------------- |
| access       | string                     | ❌                   | 'private', 'protected', or public'                                |
| initialState | TState                     | ❌                   | The starting value of the state.                                  |
| key          | string                     | ✅ (only for public) | Unique identifier for the state. Required only for public access. |
| onUpdate     | (newState: TState) => void | ❌                   | Called whenever the state is updated. Useful for side effects.    |
| persist      | boolean                    | ❌                   | Enables localStorage persistence (only for public access).        |

### 🔁 Returns

`IStateWorker<TState>`

| Property   | Type                    | Description                                                                                                                       |
| ---------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| getter()   | () => TState            | Returns the current state.                                                                                                        |
| setter()   | (state: TState) => void | Updates the state and triggers onUpdate. For public and protected state this dispatches onUpdate for all subscribers to this key. |
| destructor | () => void (optional)   | Cleans up stored state and listeners (mainly used in public).                                                                     |

### 🔐 Access Levels

| Access    | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| private   | Scoped to the current component instance. Fully isolated.                           |
| protected | Shared across component instances, scoped by internal keying, but not persisted.    |
| public    | Globally accessible across the app. Requires a key and can persist to localStorage. |

### 🧪 Example: Private state

```
const { getter, setter } = useState<number>({
  access: 'private',
  initialState: 0,
  onUpdate: (newVal) => console.log('Updated:', newVal),
});
```

### 🧪 Example: Public, persisted state

```
const counter = useState<number>({
  access: 'public',
  key: 'global-counter',
  initialState: 1,
  persist: true,
});
```

### 🧪 Example: Protected shared state

```
// Declared at module level.

const useUserMode = useState<string>({
  access: 'protected',
  initialState: 'guest',
});


// From any component(s)/method(s) which import the custom hook:

const { getter: getUserMode, setter: setUserMode } = useUserMode({
  onUpdate: (userMode: string) => console.log('Updated', userMode);
});
```

### 🚨 Notes

- `key` is only required when using public access. You can omit it entirely for private and protected modes.
- `public` state supports `localStorage` persistence when `persist: true` is enabled.
- ComposifyJS will throw a descriptive error if an invalid access modifier is passed or if a `public` state is missing a `key`.

<br/>

## 🔧 Utilities - Element Class Manipulation

ComposifyJS provides several utility functions to simplify working with class names on DOM elements. These helpers support flexible input types including strings, string arrays, and objects containing class name values.

<br/>

## `addClassesToElement`

Adds one or more classes to a given DOM element. Accepts either a selector string or an actual `HTMLElement`, and class definitions in string, array, or object form.

### 📦 Import

```
import { addClassesToElement } from 'composifyjs';
```

### 🧾 Syntax

```
addClassesToElement(
  element: string | HTMLElement,
  classes: TElementClasses
): void
```

### 🧪 Example

```
addClassesToElement('#my-box', ['bg-red', 'text-lg']);
addClassesToElement(myElement, { box: 'p-4', layout: 'grid' });
```

<br/>

---

<br/>

## `elementHasClasses`

Checks whether an element contains specific class names. Returns an array of matching class names.

### 📦 Import

```
import { elementHasClasses } from 'composifyjs';
```

### 🧾 Syntax

```
elementHasClasses(
  element: string | HTMLElement,
  classes: TElementClasses
): string[]
```

### 🧪 Example

```
const found = elementHasClasses(myDiv, ['hidden', 'active']);
console.log(found); // ['active']
```

<br/>

---

<br/>

## `removeClassesFromElement`

Removes one or more class names from the specified element.

### 📦 Import

```
import { removeClassesFromElement } from 'composifyjs';
```

### 🧾 Syntax

```
removeClassesFromElement(
  element: string | HTMLElement,
  classes: TElementClasses
): void
```

### 🧪 Example

```
removeClassesFromElement('#modal', 'hidden');
removeClassesFromElement(myNode, ['hidden', 'disabled']);
```

<br/>

## 🔧 Utilities - DOM Element Resolution

## `getElement`

Attempts to resolve a DOM element from a string ID or return the element itself if already provided. If the element doesn’t exist and `elementTypeIfNotExists` is provided, it will create a new element of the specified type.

### 📦 Import

```
import { getElement } from 'composifyjs';
```

### 🧾 Syntax

```
getElement(
  elementOrElementId: string | HTMLElement | Element,
  elementTypeIfNotExists?: string,
  withNamespace?: boolean | string
): HTMLElement
```

### ⚙️ Parameters

- `elementOrElementId`: A string (interpreted as an `id`) or a DOM `Element/HTMLElement`.
- `elementTypeIfNotExists` (optional): If the string ID is not found, a new element of this type will be created.
- `withNamespace` (optional): If `true`, or a string, uses `createElementNS` with either a default or custom namespace.

### 🔁 Returns

- The resolved or newly created HTMLElement.

### 🧪 Example

```
const el1 = getElement('app-root');
// throws if not found

const el2 = getElement('canvas', 'canvas');
// creates a <canvas> element if 'canvas' ID not found

const el3 = getElement('svg-root', 'svg', 'http://www.w3.org/2000/svg');
// creates an <svg> element in SVG namespace if not found
```

### 🚨 Notes

- Will throw an error if the element is not found and elementTypeIfNotExists is not provided.
- Useful for resilient DOM manipulation in apps where elements may not yet exist at runtime.

<br/>

## 🔧 Utilities – DOM Element Coordinates

## `getElementCoords`

Returns a standardized object containing the top, left, width, and height values of a given DOM element, parsed from computed styles. Optionally parses the values as floats.

### 📦 Import

```
import { getElementCoords } from 'composifyjs';
```

### 🧾 Syntax

```
getElementCoords(
  element: HTMLElement,
  asFloats?: boolean
): Record<'top' | 'left' | 'width' | 'height', number>
```

### ⚙️ Parameters

- `element`: The DOM element to read coordinates from.
- `asFloats` (optional): If `true`, coordinates are returned as `float`s. Defaults to `false` (integers).

### 🔁 Returns

An object:

```
{
  top: number,
  left: number,
  width: number,
  height: number
}
```

### 🧪 Example

```
const coords = getElementCoords(myDiv);
// { top: 200, left: 50, width: 300, height: 150 }

const preciseCoords = getElementCoords(myDiv, true);
// { top: 199.8, left: 50.12, width: 299.5, height: 149.9 }
```

### 🚨 Notes

- Relies on `window.getComputedStyle`, so results may differ slightly from `getBoundingClientRect`.
- Logs a warning and trace if any of the coordinate values are not returned in `px`.
- Throws if a value cannot be parsed into a number.

<br/>

## 🔧 Utilities – Miscellaneous

## `getHash`

Generates a pseudo-random hexadecimal hash string, useful for creating unique identifiers when needed. It optionally accepts a prefix and a custom length.

### 📦 Import

```
import { getHash } from 'composifyjs';
```

### 🧾 Syntax

```
interface IGetHashOptions {
  prefix?: string;
  length?: number;
}

export const getHash: (options?: IGetHashOptions) => string;
```

### ⚙️ Parameters

| Name   | Type   | Description                             | Default |
| ------ | ------ | --------------------------------------- | ------- |
| prefix | string | Optional string to prepend to the hash. | ''      |
| length | number | Desired length of the generated hash.   | 8       |

### 🔁 Returns

A string containing the generated hexadecimal hash with optional prefix.

### 🧪 Example

```
const id = getHash(); // "f3c81e2a"
const prefixedId = getHash({ prefix: 'elem-' }); // "elem-8ab34c92"
const longId = getHash({ length: 16 }); // "d91feaa2cb3d4f10"
```

### 🚨 Notes

- The generated hash uses base-16 characters (0-9, a-f) and is not cryptographically secure.
- Ideal for UI identifiers, not secure tokens.
- Uses a slight over-randomization strategy (Math.random() \* 16.4 - 1) to reduce zero-padding frequency.

<br />

## 🔌 Plugins

ComposifyJS Plugins are optional behaviors you can apply to DOM elements to enhance interactivity and layout control. Each plugin returns a `destructor()` method for clean teardown, ensuring no lingering side effects. (The plugins may be separated into a separate child library and expanded upon down the road.)

<br />

## `makeMaximizable`

Adds maximization behavior to an element, allowing it to toggle between a constrained layout and full expansion. Requires a trigger element to activate toggling.

### 📦 Import

```
import { makeMaximizable } from 'composifyjs';
```

### 🧾 Syntax

```
makeMaximizable(props: {
  element: HTMLElement;
  initiallyMaximized?: boolean;
  movementConstraint: TDirectionConstraint;
  sizeConstraints?: TCoordConstraint;
  triggerElement: HTMLElement;
}): {
  destructor(): void;
  toggleMaximized(): void;
  isMaximized: boolean;
}
```

### ⚙️ Parameters

- `element`: The element to maximize.
- `initiallyMaximized` (optional): Whether the element starts in a maximized state.
- `movementConstraint`: Axis to constrain movement (e.g. `'x'`, `'y'`, `'both'`, `'none'`).
- `sizeConstraints` (optional): Maximum allowed width/height.
- `triggerElement`: Element used to toggle maximization.

<br />

## `makeMovable`

Enables drag movement of an element within its parent, constrained to a specific axis if desired.

### 📦 Import

```
import { makeMovable } from 'composifyjs';
```

### 🧾 Syntax

```
makeMovable(props: {
  element: HTMLElement;
  movementConstraint: TDirectionConstraint;
  parentElement: HTMLElement;
}): {
  destructor(): void;
}
```

### ⚙️ Parameters

- `element`: The element to make draggable.
- `movementConstraint`: Constrain movement along `'x'`, `'y'`, `'both'`, or `'none'`.
- `parentElement`: The element to use as the bounding container.

<br />

## `makeResizable`

Allows an element to be resized via dragging, with optional inversion and axis constraints.

### 📦 Import

```
import { makeResizable } from 'composifyjs';
```

### 🧾 Syntax

```
makeResizable(props: {
  element: HTMLElement;
  inverseResize?: TDirectionConstraint;
  movementConstraint: TDirectionConstraint;
  parentElement: HTMLElement;
  sizeConstraints?: TCoordConstraint;
}): {
  destructor(): void;
}
```

### ⚙️ Parameters

- `element`: Element to resize.
- `inverseResize` (optional): Reverse resizing direction for constrained axes.
- `movementConstraint`: Axis or axes to resize along.
- `parentElement`: Container for boundary enforcement.
- `sizeConstraints` (optional): Width/height limitations.

<br />

## `makeStackable`

### 📦 Import

```
import { makeStackable } from 'composifyjs';
```

Adds Z-index-style stacking behavior. Calling `bringToTop()` will promote the element above other similarly stacked elements.

### 🧾 Syntax

```
makeStackable(props: {
  className: string;
  element: HTMLElement;
  triggerElement?: HTMLElement;
}): {
  bringToTop(): void;
  destructor(): void;
}
```

### ⚙️ Parameters

- `className`: Class name shared by all stackable elements.
- `element`: The target element to stack.
- `triggerElement` (optional): A sub-element that when clicked will call `bringToTop()` automatically.
