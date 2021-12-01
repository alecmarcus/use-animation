# useAnimation

Simple, hooks-based animations for React.

## Install

### [yarn](https://yarnpkg.com/)

```
yarn add @alecmarcus/use-animation
```

### [npm](https://www.npmjs.com/)

```
npm install @alecmarcus/use-animation
```

## Import

### ES Module

```
import useAnimation from "@alecmarcus/use-animation";
```

### CommonJS

```
const useAnimation = require("@alecmarcus/use-animation");
```

## Use

### Basic

#### Example

In this case, the div stored in `helloWorldRef` will fade in when the component first renders.

```
import { useLayoutEffect, useRef } from "react";
import useAnimation from "@alecmarcus/use-animation";

const ComponentWithAnimation = () => {
  const helloWorldRef = useRef(null)

  const [fadeIn] = useAnimation({
    node: helloWorldRef,
    from: { opacity: 0 },
    to : { opacity: 1 },
    duration: 500,
    ease: "outQuart",
  })

  useLayoutEffect(() => {
    fadeIn();
  }, [fadeIn])

  return (
    <div ref={helloWorldRef}>
      Hello, world.
    </div>
  )
}
```

#### Steps

In simplest terms, creating an animation requires three steps:

1. Create a node ref to animate.
   ```
   const nodeRef = useRef(null);
   ```

2. Create and configure an animation function.
   ```
    const [fadeIn] = useAnimation({
      node: nodeRef,
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 500,
      ease: "outQuart",
    });
   ```

3. Call the animation function.
   ```
   fadeIn();
   ```

### Advanced

#### Examples

Compose animations and interactivity by passing arrays of callback functions to your animation functions.

```
import { useRef, useState } from "react";
import { Dashboard, Login } from "components";
import useAnimation from "@alecmarcus/use-animation";

const App = () => {
  const dashboard = useRef(null);
  const login = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showDashboard = () => loginExit([
    () => setIsLoggedIn(true),
    dashboardEnter
  ]);

  const [loginExit] = useAnimation({
    node: login,
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: 500,
    ease: "outQuart",
  })

  const [dashboardEnter] = useAnimation({
    node: dashboard,
    from: {
      opacity: 0,
      transform: 'scale(1.1)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
    duration: 500,
    ease: "outQuart",
  })

  return isLoggedIn ? (
    <Dashboard ref={dashboard} />
  ) : (
    <Login onAuth={showDashboard} ref={login} />
  )
}
```

Or create timeline-based animations by specifying keyframes and delays with your callbacks.

```
import { useRef } from "react";
import useAnimation from "@alecmarcus/use-animation";

const DelayedAnimation = () => {


  return (

  )
}
```
