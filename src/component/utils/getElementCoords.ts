import { coordAttributes, TCoordAttribute } from 'src/component';

export const getElementCoords = (
  element: HTMLElement,
  asFloats?: boolean
): Record<TCoordAttribute, number> => {
  const computedStyle = window.getComputedStyle(element);

  return Object.fromEntries(
    coordAttributes.map((coordAttribute) => {
      const attribute = computedStyle[coordAttribute] ?? '';

      if (!/^\-{0,1}[0-9]{0,}px$/.test(attribute.trim())) {
        console.warn(
          `getElementCoords encountered a non px unit for ${coordAttribute}` +
            ' which may cause unintended behavior.',
          `\n\nValue: ${attribute}`
        );
        console.trace('getElementCoords: non px value encountered');
      }

      const parsedAttribute = asFloats
        ? parseFloat(attribute)
        : parseInt(attribute);

      if (isNaN(parsedAttribute)) {
        throw new Error(
          `getElementCoords could not resolve value for ${coordAttribute}` +
            ' to a number which may cause unintended behavior'
        );
      }

      return [coordAttribute, parseInt(computedStyle[coordAttribute] ?? '')];
    })
  ) as Record<TCoordAttribute, number>;
};
