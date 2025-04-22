import { getElementCoords, TDirectionConstraint } from 'src/component';

interface IMakeMovableProps {
  element: HTMLElement;
  movementConstraint: TDirectionConstraint;
  parentElement: HTMLElement;
}

interface IMakeMovableReturn {
  destructor: () => void;
}

export const makeMovable = ({
  element,
  movementConstraint,
  parentElement,
}: IMakeMovableProps): IMakeMovableReturn => {
  let deltaX: number,
    deltaY: number,
    originalCoords: ReturnType<typeof getElementCoords>;

  if (
    !['relative', 'fixed', 'absolute'].includes(
      window.getComputedStyle(parentElement).position.toLowerCase()
    )
  ) {
    console.warn(
      'makeMovable requires parentElement to have a non static/sticky css position attribute'
    );
  }

  const handlePointerMove = (e: PointerEvent) => {
    const parentCoords = getElementCoords(parentElement);

    if (movementConstraint !== 'y') {
      const newLeft = Math.min(
        Math.max(0, e.clientX - deltaX),
        window.innerWidth - parentCoords.width
      );

      if (newLeft !== parentCoords.left) {
        parentElement.style.left = newLeft + 'px';
      }
    }

    if (movementConstraint !== 'x') {
      const newTop = Math.min(
        Math.max(0, e.clientY - deltaY),
        window.innerHeight - parentCoords.height
      );

      if (newTop !== parentCoords.top) {
        parentElement.style.top = newTop + 'px';
      }
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    originalCoords = getElementCoords(parentElement);
    deltaX = e.clientX - originalCoords.left;
    deltaY = e.clientY - originalCoords.top;

    element.addEventListener('pointermove', handlePointerMove);

    if (typeof e.pointerId !== 'undefined') {
      element.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    element.removeEventListener('pointermove', handlePointerMove);

    if (typeof e.pointerId !== 'undefined') {
      element.releasePointerCapture(e.pointerId);
    }
  };

  const destructor = () => {
    element.removeEventListener('pointerdown', handlePointerDown);
    element.removeEventListener('pointermove', handlePointerMove);
    element.removeEventListener('pointerup', handlePointerUp);
  };

  element.addEventListener('pointerdown', handlePointerDown);
  element.addEventListener('pointerup', handlePointerUp);

  return {
    destructor,
  };
};
