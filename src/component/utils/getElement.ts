export const getElement = (
  elementOrElementId: string | HTMLElement | Element,
  elementTypeIfNotExists?: string,
  withNamespace?: boolean | string
): HTMLElement => {
  const element =
    elementOrElementId instanceof HTMLElement ||
    elementOrElementId instanceof Element
      ? elementOrElementId
      : document.getElementById(elementOrElementId) ||
        (elementTypeIfNotExists
          ? withNamespace
            ? document.createElementNS(
                typeof withNamespace === 'string' ? withNamespace : null,
                elementTypeIfNotExists as string
              )
            : document.createElement(elementTypeIfNotExists as string)
          : undefined);

  if (!element && !elementTypeIfNotExists) {
    throw new Error('getElement could not find the target element');
  }

  return element as HTMLElement;
};
