import { IStateWorker, IUseStateArgs } from 'src/state';
import { dispatchEvents } from '../../utils';

interface IGenericStateWorkerArgs<TState>
  extends Pick<IUseStateArgs<TState>, 'onUpdate'> {
  events: Record<string, Function[]>;
  key: string;
  state: TState | undefined;
}

export const genericStateWorker = <TState = unknown>({
  events,
  key,
  onUpdate,
  state,
}: IGenericStateWorkerArgs<TState>): IStateWorker<TState> => {
  if (typeof onUpdate === 'function') {
    if (!events[key]) {
      events[key] = [];
    }

    events[key].push(onUpdate);
  }

  dispatchEvents<TState>(events, key, state as TState);

  return {
    getter: () => state as TState,
    setter: (newState: TState) => {
      state = newState;
      dispatchEvents<TState>(events, key, newState);
    },
    destructor: () => {
      if (typeof onUpdate === 'function') {
        const index = (events[key] ?? []).indexOf(onUpdate);

        if (index !== -1) {
          events[key].splice(index, 1);
        }
      }
    },
  };
};
