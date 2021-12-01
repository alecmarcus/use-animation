import { useRef, useState } from "react";
import { constructInterface, formatValue, is, msToFrame } from "./utils";
import { AnimationFunction, AnimationState, Keyframes, UseAnimationHook } from "./types";
import easingFunctions from "./easings";

const useAnimation: UseAnimationHook = ({
  node,
  from,
  to,
  duration = 500,
  ease = "inOutSine",
  delay,
}) => {
  const frames = msToFrame(duration);
  const frame = useRef(0);

  const [animationState, setAnimationState] = useState<AnimationState>("NOT_STARTED");

  const toInterface = constructInterface(to);
  const fromInterface = constructInterface(from);

  // Cast easing function name or definition to function.
  const easingFunction = typeof ease === "string" ? easingFunctions[ease] : ease;

  const animation: AnimationFunction = (callback) => {
    if (node.current && toInterface) {
      // Set animation state, avoiding needless updates.
      if (animationState !== "PLAYING") {
        setAnimationState("PLAYING");
      }

      // Increment progress.
      frame.current += 1;

      if (is.obj(callback)) {
        // Construct a list of start times from the given keyframes.
        const cbStartTimes = Object.keys(callback as Keyframes).map((t) => parseInt(t));

        cbStartTimes.forEach((t) => {
          /* Loop through start times to see if any match the current frame.
           * If one does, execute its callback.
           */
          if (frame.current === msToFrame(t)) {
            [(callback as Keyframes)[t]].flat().forEach((animation) => animation());
          }
        });
      }

      for (const propertyName in toInterface) {
        let currentValue;

        const to = toInterface[propertyName];

        if (fromInterface?.[propertyName]) {
          const from = fromInterface[propertyName];
          currentValue =
            from.value.number -
            easingFunction(frame.current / frames) * (from.value.number - to.value.number);
        } else {
          currentValue = easingFunction(frame.current / frames) * to.value.number;
        }

        node.current.style[propertyName] = formatValue(to, currentValue);
      }

      // Continue the callback loop until complete. Make sure to keep passing the user callback!
      if (frame.current < frames) {
        // If delay is given and the animation has not begun.
        if (frame.current === 0 && delay) {
          setTimeout(() => window.requestAnimationFrame(() => animation(callback)), delay);
        } else {
          window.requestAnimationFrame(() => animation(callback));
        }
      }

      if (frame.current === frames) {
        // Update animation state.
        setAnimationState("COMPLETE");

        // When finished, execute the callback on the next frame.
        if (is.fnc(callback)) {
          window.requestAnimationFrame(() => (callback as AnimationFunction)());
        }
      }
    } else {
      throw new Error(`Error at frame ${frame.current}: animation target element ref was null.`);
    }
  };

  return [animation, animationState];
};

export default useAnimation;
