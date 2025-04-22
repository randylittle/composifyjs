import {
  IBaseComponentProps,
  IBaseComponentReturn,
  TComponent,
} from './component';

export interface IElementComponentProps extends IBaseComponentProps {
  parentId?: string;
}

export interface IElementComponentReturn<TDestructor = () => void>
  extends Omit<IBaseComponentReturn, 'destructor'> {
  destructor: TDestructor;
  element: HTMLElement;
}

export type TElementComponent<
  TProps = unknown,
  TReturn = unknown,
  TDestructor = () => void
> = TComponent<
  IElementComponentProps & TProps,
  IElementComponentReturn<TDestructor> & TReturn,
  TDestructor
>;

export type TElementClasses =
  | string
  | string[]
  | { readonly [key: string]: string };
