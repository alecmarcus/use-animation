import { MilliSeconds, CSSValueInterface } from "./types";

export const is = {
  fnc: (u: unknown): boolean => u instanceof Function,
  obj: (u: unknown): boolean => !!u && typeof u === "object" && !(u instanceof Function),
};

/**
 * Converts milliseconds to frames at a given resolution.
 *
 * @param ms {number} Time in milliseconds
 * @param fps {number} Frames per second to convert at
 * @returns The given time converted to frames
 */
export const msToFrame = (ms: MilliSeconds, fps = 60): number => (ms / 1000) * fps;

/**
 * Deconstructs CSS value strings (eg, rotate(30deg)).
 * Isolates the number, unit, and surrounding text, and stores each in an object.
 * Makes interpolation more straightforward in the animation function.
 *
 * @see toInterface for usage.
 *
 * @param to {string | number} A CSS property value
 * @returns {CSSValueInterface} An object containing a `value` object with number and unit, and a `context` object with prefix & suffix (if they exist).
 * */
export const parseValue = (to: string | number): CSSValueInterface => {
  const toAsString = to.toString();

  /* For values with units, like px, em, %, etc.
   * (-?[\d.]+) Grabs an optional "-" followed by digits or dots
   * ([a-z%]*)  Finds all letters or % signs that directly follow the number
   */
  const valueParts = toAsString.match(/(-?[\d.]+)([a-z%]*)/);
  const value = {
    number: parseFloat((valueParts as RegExpMatchArray)[1]),
    unit: (valueParts as RegExpMatchArray)[2],
  };

  /* For values wrapped in functions, like scale(), rotate(), etc.
   * Gets all string parts prior to and following the matched value
   * above, if any exist, and stores them as prefix and suffix.
   */
  const contextParts = toAsString.split(
    `${(valueParts as RegExpMatchArray)[1]}${(valueParts as RegExpMatchArray)[2]}`
  );
  const context = {
    prefix: contextParts[0],
    suffix: contextParts[1],
  };

  return { value, context };
};

/**
 * Sets up an object of objects for each property in the given declaration,
 * that can be used to interpolate complex value strings like `rotate(30deg)`.
 *
 * @see parseValue for how value strings are converted to interfaces.
 *
 * @param {CSSStyleDeclaration | undefined} declaration A CSS style declaration as a JS object.
 * @returns {Record<keyof typeof declaration, CSSValueInterface> | null} An object of CSS value interfaces, keyed by their corresponding properties.
 */
export const constructInterface = (declaration?: CSSStyleDeclaration) => {
  if (declaration) {
    let output = {};

    for (const propertyName in declaration) {
      const valueInterface = parseValue(declaration[propertyName]);
      output = {
        ...output,
        [propertyName]: valueInterface,
      };
    }

    return output as Record<keyof typeof declaration, CSSValueInterface>;
  } else {
    return null;
  }
};

export const formatValue = ({ context, value }: CSSValueInterface, number: number): string =>
  `${context.prefix}${number}${value.unit}${context.suffix}`;
