import {
  getElementCoords,
  TCoordConstraint,
  TDirectionConstraint,
} from 'src/component';

interface IMakeMaximizableProps {
  element: HTMLElement;
  initiallyMaximized?: boolean;
  movementConstraint: TDirectionConstraint;
  sizeConstraints?: TCoordConstraint;
  triggerElement: HTMLElement;
}

interface IMakeMaximizableReturn {
  destructor: () => void;
  toggleMaximized: () => void;
  isMaximized: boolean;
}

export const makeMaximizable = ({
  element,
  initiallyMaximized,
  movementConstraint,
  sizeConstraints,
  triggerElement,
}: IMakeMaximizableProps): IMakeMaximizableReturn => {
  let isMaximized: boolean = false;
  let originalCoords: ReturnType<typeof getElementCoords>;

  const maximize = () => {
    if (movementConstraint !== 'y') {
      element.style.left = '0px';
      element.style.width =
        (sizeConstraints?.max?.width ?? window.innerWidth) + 'px';
    }
    if (movementConstraint !== 'x') {
      element.style.top = '0px';
      element.style.height =
        (sizeConstraints?.max?.height ?? window.innerHeight) + 'px';
    }
  };

  const cancelMaximizeMaybe = new ResizeObserver(() => {
    const currentCoords = getElementCoords(element);

    if (
      (movementConstraint !== 'y' &&
        currentCoords.width !== window.innerWidth) ||
      (movementConstraint !== 'x' &&
        currentCoords.height !== window.innerHeight)
    ) {
      isMaximized = false;
      cancelMaximizeMaybe.unobserve(element);
    }
  });

  const handlePointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    if (isMaximized) {
      if (movementConstraint !== 'y') {
        element.style.left = originalCoords.left + 'px';
        element.style.width = originalCoords.width + 'px';
      }
      if (movementConstraint !== 'x') {
        element.style.top = originalCoords.top + 'px';
        element.style.height = originalCoords.height + 'px';
      }

      cancelMaximizeMaybe.unobserve(element);
      window.removeEventListener('resize', maximize);
      window.removeEventListener('orientationchange', maximize);
    } else {
      originalCoords = getElementCoords(element);
      maximize();
      cancelMaximizeMaybe.observe(element);
      window.addEventListener('resize', maximize);
      window.addEventListener('orientationchange', maximize);
    }

    isMaximized = !isMaximized;
  };

  const destructor = () => {
    triggerElement.removeEventListener('pointerdown', handlePointerDown);

    if (isMaximized) {
      cancelMaximizeMaybe.unobserve(element);
      window.removeEventListener('resize', maximize);
      window.removeEventListener('orientationchange', maximize);
    }
  };

  const toggleMaximized = () => {
    handlePointerDown({ isPrimary: true } as PointerEvent);
  };

  triggerElement.addEventListener('pointerdown', handlePointerDown);

  if (initiallyMaximized) {
    handlePointerDown({ isPrimary: true } as PointerEvent);
  }

  return {
    destructor,
    isMaximized,
    toggleMaximized,
  };
};
