export type TStateDestructor = () => void;
export type TStateGetter<TState> = () => TState;
export type TStateSetter<TState> = (newState: TState) => void;
export type TStateUpdateEvent<TState> = TStateSetter<TState>;

export interface IStateWorker<TState> {
  getter: TStateGetter<TState>;
  setter: TStateSetter<TState>;
  destructor?: TStateDestructor;
}

export interface IPublicStateEntry<TState = unknown> {
  lastUpdated: string;
  value: TState;
}

export const typedWindowState = window as unknown as {
  STACKED_publicState: Record<string, unknown>;
};

export type TStateAccess = 'private' | 'protected' | 'public';
