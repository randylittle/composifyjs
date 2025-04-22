export type TCoordAttribute = 'top' | 'left' | 'width' | 'height';

export const coordAttributes: TCoordAttribute[] = [
  'top',
  'left',
  'width',
  'height',
];

export type TCoord<TUnit = number> = Record<
  Exclude<TCoordAttribute, 'width' | 'height'>,
  TUnit
> &
  Partial<Record<Exclude<TCoordAttribute, 'top' | 'left'>, TUnit>>;

export type TCoordConstraint<TCoordType = Partial<TCoord>> = Partial<{
  min: TCoordType;
  max: TCoordType;
}>;
