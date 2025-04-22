import { IStateWorker } from 'src/state';
import { getHash } from 'src/utils';
import { IUseStateArgs } from '.';
import { genericStateWorker } from './generic';

type TProtectedStateWorkerArgs<TState> = Pick<
  IUseStateArgs<TState>,
  'initialState'
>;

export type TProtectedStateInitializedWorkerArgs<TState> = Pick<
  IUseStateArgs<TState>,
  'onUpdate'
>;

export const protectedStateWorker = <TState = unknown>({
  initialState,
}: TProtectedStateWorkerArgs<TState>): ((
  args?: TProtectedStateInitializedWorkerArgs<TState>
) => IStateWorker<TState>) => {
  const events: Record<string, Function[]> = {};
  let state: TState | undefined = initialState;
  const key = getHash({ length: 32 });

  return (
    rest?: TProtectedStateInitializedWorkerArgs<TState>
  ): IStateWorker<TState> =>
    genericStateWorker({ events, key, state, ...rest });
};
