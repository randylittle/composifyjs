import { TElementClasses } from 'src/component';
import { getElement } from './getElement';

export const addClassesToElement = (
  element: string | HTMLElement,
  classes: TElementClasses
) => {
  const safeElement = getElement(element);
  const currentClasses = (safeElement.getAttribute('class') || '').split(' ');

  safeElement.setAttribute(
    'class',
    [
      ...currentClasses,
      ...(typeof classes === 'object'
        ? classes instanceof Array
          ? classes
          : Object.values(classes)
        : [classes]),
    ]
      .join(' ')
      .replace(/\./gim, '')
      .trim()
  );
};

export const elementHasClasses = (
  element: string | HTMLElement,
  classes: TElementClasses
) => {
  const searchClasses = [
    ...(typeof classes === 'object'
      ? classes instanceof Array
        ? classes
        : Object.values(classes)
      : [classes]),
  ];

  return (getElement(element).getAttribute('class') || '')
    .split(' ')
    .filter((elementClass) => searchClasses.includes(elementClass));
};

export const removeClassesFromElement = (
  element: string | HTMLElement,
  classes: TElementClasses
) => {
  const safeElement = getElement(element);

  const searchClasses = [
    ...(typeof classes === 'object'
      ? classes instanceof Array
        ? classes
        : Object.values(classes)
      : [classes]),
  ];

  const currentClasses = (safeElement.getAttribute('class') || '').split(' ');

  safeElement.setAttribute(
    'class',
    currentClasses
      .filter((currentClass) => !searchClasses.includes(currentClass))
      .join(' ')
  );
};
