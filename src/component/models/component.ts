export interface IBaseComponentProps {
  id?: string;
}

export interface IBaseComponentReturn<TDestructor = () => void> {
  destructor?: TDestructor;
  id: string;
}

export type TComponent<
  TProps = unknown,
  TReturn = unknown,
  TDestructor = () => void
> = (
  props: IBaseComponentProps & TProps
) => IBaseComponentReturn<TDestructor> & TReturn;
