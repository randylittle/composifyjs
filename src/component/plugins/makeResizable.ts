import {
  getElementCoords,
  TCoordConstraint,
  TDirectionConstraint,
} from 'src/component';

interface IMakeResizableProps {
  element: HTMLElement;
  inverseResize?: TDirectionConstraint;
  movementConstraint: TDirectionConstraint;
  parentElement: HTMLElement;
  sizeConstraints?: TCoordConstraint;
}

interface IMakeResizableReturn {
  destructor: () => void;
}

export const makeResizable = ({
  element,
  inverseResize,
  movementConstraint,
  parentElement,
  sizeConstraints,
}: IMakeResizableProps): IMakeResizableReturn => {
  let deltaX: number,
    deltaY: number,
    inverseDeltaX: number,
    inverseDeltaY: number,
    originalCoords: ReturnType<typeof getElementCoords>;

  const resizeParent = (
    e: PointerEvent,
    constraint: TDirectionConstraint,
    parentCoords: ReturnType<typeof getElementCoords>
  ) => {
    if (constraint === 'x') {
      parentElement.style.width =
        Math.min(
          Math.max(
            sizeConstraints?.min?.width ?? 0,
            e.clientX - parentCoords.left + deltaX
          ),
          window.innerWidth - parentElement.offsetLeft
        ) + 'px';
    } else {
      parentElement.style.height =
        Math.min(
          Math.max(
            sizeConstraints?.min?.height ?? 0,
            e.clientY - parentCoords.top + deltaY
          ),
          window.innerHeight - parentElement.offsetTop
        ) + 'px';
    }
  };

  const inverseResizeParent = (
    e: PointerEvent,
    constraint: TDirectionConstraint,
    parentCoords: ReturnType<typeof getElementCoords>
  ) => {
    if (constraint === 'x') {
      const newLeft = Math.min(
        Math.max(0, e.clientX + inverseDeltaX),
        originalCoords.left +
          originalCoords.width -
          (sizeConstraints?.min?.width ?? 0)
      );

      if (newLeft !== parentCoords.left) {
        parentElement.style.left = newLeft + 'px';
        parentElement.style.width =
          Math.max(
            sizeConstraints?.min?.width ?? 0,
            originalCoords.width - (newLeft - originalCoords.left)
          ) + 'px';
      }
    } else {
      const newTop = Math.min(
        Math.max(0, e.clientY + inverseDeltaY),
        originalCoords.top +
          originalCoords.height -
          (sizeConstraints?.min?.height ?? 0)
      );

      if (newTop !== parentCoords.top) {
        parentElement.style.top = newTop + 'px';
        parentElement.style.height =
          Math.max(
            sizeConstraints?.min?.height ?? 0,
            originalCoords.height - (newTop - originalCoords.top)
          ) + 'px';
      }
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    const parentCoords = getElementCoords(parentElement);

    if (movementConstraint !== 'y') {
      if (inverseResize === 'x' || inverseResize === 'xy') {
        inverseResizeParent(e, 'x', parentCoords);
      } else {
        resizeParent(e, 'x', parentCoords);
      }
    }

    if (movementConstraint !== 'x') {
      if (inverseResize === 'y' || inverseResize === 'xy') {
        inverseResizeParent(e, 'y', parentCoords);
      } else {
        resizeParent(e, 'y', parentCoords);
      }
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    originalCoords = getElementCoords(parentElement);
    deltaX = originalCoords.left + originalCoords.width - e.clientX;
    deltaY = originalCoords.top + originalCoords.height - e.clientY;
    inverseDeltaX = originalCoords.left - e.clientX;
    inverseDeltaY = originalCoords.top - e.clientY;

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
