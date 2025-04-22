import {
  IPublicStateEntry,
  IStateWorker,
  IUseStateArgs,
  typedWindowState,
} from 'src/state';
import { dispatchEvents, updateLocalStorage } from '../../../state/utils';

type TPublicStateWorkerArgs<TState> = Pick<
  IUseStateArgs<TState>,
  'initialState' | 'key' | 'onUpdate' | 'persist'
>;

const events: Record<string, Function[]> = {};

export const publicStateWorker = <TState = unknown>({
  initialState,
  key,
  onUpdate,
  persist,
}: TPublicStateWorkerArgs<TState>): IStateWorker<TState> => {
  if (!typedWindowState.STACKED_publicState) {
    typedWindowState.STACKED_publicState = {};
  }

  if (typeof onUpdate === 'function') {
    if (!events[key]) {
      events[key] = [];
    }

    events[key].push(onUpdate);
  }

  if (typeof typedWindowState.STACKED_publicState[key] === 'undefined') {
    if (persist) {
      let storageItem: string | null | IPublicStateEntry<TState> =
        localStorage.getItem(`STACKED_${key}`);

      try {
        storageItem = JSON.parse(
          storageItem ?? ''
        ) as IPublicStateEntry<TState>;
      } catch {}

      typedWindowState.STACKED_publicState[key] =
        typeof storageItem === 'object'
          ? (storageItem?.value as TState)
          : initialState;

      if (storageItem === null && typeof initialState !== 'undefined') {
        updateLocalStorage<TState>(key, initialState);
      }
    } else {
      typedWindowState.STACKED_publicState[key] = initialState;
    }
  }

  dispatchEvents<TState>(
    events,
    key,
    typedWindowState.STACKED_publicState[key] as TState
  );

  return {
    getter: () => typedWindowState.STACKED_publicState[key] as TState,
    setter: (newState: TState) => {
      typedWindowState.STACKED_publicState[key] = newState;

      if (persist) {
        updateLocalStorage<TState>(key, newState);
      }

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
