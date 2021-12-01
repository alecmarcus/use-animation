import { RefObject } from "react";
import { EasingFunction, EasingFunctionName } from "./easings";

export type MilliSeconds = number;
export type AnimationState = "NOT_STARTED" | "PLAYING" | "COMPLETE";
export type AnimationFunction = (callback?: AnimationFunction | Keyframes) => void;
export type UseAnimationHook = (options: AnimationOptions) => [AnimationFunction, AnimationState];

export interface Keyframes {
  [time: MilliSeconds]: AnimationFunction | AnimationFunction[];
}

export interface AnimationOptions {
  node: RefObject<HTMLElement>;
  to: CSSStyleDeclaration;
  from?: CSSStyleDeclaration;
  duration: MilliSeconds;
  ease: EasingFunction | EasingFunctionName;
  delay?: MilliSeconds;
}

export interface CSSValueInterface {
  value: {
    number: number;
    unit?: string;
  };
  context: {
    prefix?: string;
    suffix?: string;
  };
}
