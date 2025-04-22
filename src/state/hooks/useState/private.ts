import { IStateWorker } from 'src/state';
import { getHash } from 'src/utils';
import { IUseStateArgs } from '.';
import { genericStateWorker } from './generic';

type TPrivateStateWorkerArgs<TState> = Pick<
  IUseStateArgs<TState>,
  'initialState' | 'onUpdate'
>;

const events: Record<string, Function[]> = {};

export const privateStateWorker = <TState = unknown>({
  initialState,
  onUpdate,
}: TPrivateStateWorkerArgs<TState>): IStateWorker<TState> => {
  let state: TState | undefined = initialState;
  const key = getHash({ length: 32 });

  return genericStateWorker({ events, key, onUpdate, state });
};
