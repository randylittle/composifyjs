interface IMakeStackableProps {
  className: string;
  element: HTMLElement;
  triggerElement?: HTMLElement;
}

interface IMakeStackableReturn {
  bringToTop: () => void;
  destructor: () => void;
}

export const makeStackable = ({
  className,
  element,
  triggerElement,
}: IMakeStackableProps): IMakeStackableReturn => {
  const getElements = () =>
    new Map(
      Array.from(
        document.getElementsByClassName(
          className
        ) as HTMLCollectionOf<HTMLElement>
      )
        .filter((element) => element.style.zIndex !== '')
        .map((element) => [element.style.zIndex, element])
    );

  const bringToTop = (e?: PointerEvent) => {
    if (e instanceof PointerEvent && !e.isPrimary) {
      return;
    }

    const elements = getElements();
    const elementAtTop = elements.get(elements.size.toString());
    const originalZIndex = element.style.zIndex;

    if (originalZIndex === elements.size.toString()) {
      return;
    }

    if (elementAtTop) {
      element.style.zIndex = (elements.size + 1).toString();
    }

    for (let i = parseInt(originalZIndex) + 1; i <= elements.size; i++) {
      const element = elements.get(i.toString());

      if (element) {
        element.style.zIndex = (i - 1).toString();
      }
    }

    element.style.zIndex = elements.size.toString();
  };

  const destructor = () => {
    (triggerElement ?? element).removeEventListener('pointerdown', bringToTop);
  };

  element.style.zIndex = (getElements().size + 1).toString();
  (triggerElement ?? element).addEventListener('pointerdown', bringToTop);

  return {
    bringToTop,
    destructor,
  };
};
