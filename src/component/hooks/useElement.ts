import {
  addClassesToElement,
  elementHasClasses,
  getElement,
  removeClassesFromElement,
  TElementClasses,
} from 'src/component';

interface IUseElementProps {
  classes?: TElementClasses;
  htmlElementType?: string;
  id: string;
  namespace?: boolean | string;
  parentId?: string;
  styles?: Record<string, string | null>;
}

interface IUseElementReturn {
  addClass: (classes: TElementClasses) => void;
  destructor?: () => void;
  element: HTMLElement;
  hasClass: (classes: TElementClasses) => void;
  removeClass: (classes: TElementClasses) => void;
  unsafeDestructor?: () => void;
}

export const useElement = ({
  classes,
  htmlElementType,
  id,
  namespace,
  parentId,
  styles,
}: IUseElementProps): IUseElementReturn => {
  let elementWasConnected = false;

  const parentElement = parentId
    ? document.getElementById(parentId)
    : document.body;

  if (!parentElement) {
    throw new Error('useElement could not find the parentElement');
  }

  const element = getElement(id, htmlElementType ?? 'div', namespace);

  if (!element.isConnected) {
    element.setAttribute('id', id);

    if (styles) {
      Object.assign(element.style, styles);
    }

    if (classes) {
      addClassesToElement(element, classes);
    }

    parentElement.appendChild(element);
  } else {
    elementWasConnected = true;
  }

  return {
    addClass: (classes: TElementClasses) =>
      addClassesToElement(element, classes),
    ...(!elementWasConnected && { destructor: () => element.remove() }),
    element,
    hasClass: (classes: TElementClasses) => elementHasClasses(element, classes),
    removeClass: (classes: TElementClasses) =>
      removeClassesFromElement(element, classes),
    ...(elementWasConnected && { unsafeDestructor: () => element.remove() }),
  };
};
