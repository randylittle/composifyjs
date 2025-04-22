import { IStateWorker, TStateAccess, TStateUpdateEvent } from 'src/state';
import { privateStateWorker } from './private';
import { protectedStateWorker } from './protected';
import { publicStateWorker } from './public';

export interface IUseStateArgs<TState> {
  access?: TStateAccess;
  initialState?: TState;
  key: string;
  onUpdate?: TStateUpdateEvent<TState>;
  persist?: boolean;
}

interface IUseStateFunc {
  <TState>(
    args: IUseStateArgs<TState> | Partial<IUseStateArgs<TState>>
  ): IStateWorker<TState>;
  <TState>(
    args: Pick<IUseStateArgs<TState>, 'access' | 'initialState'>
  ): ReturnType<typeof protectedStateWorker<TState>>;
}

const accessModifiers = [
  'private',
  'protected',
  'public',
] satisfies TStateAccess[];

const mustBeOneOfType =
  'The access modifier must be one of [' + accessModifiers.join(', ') + '].';

export const useState = (({
  access,
  initialState,
  key,
  onUpdate,
  persist,
}: IUseStateArgs<unknown>) => {
  let accessModifier = 'private';

  if (typeof access === 'string') {
    if (accessModifiers.includes(access)) {
      accessModifier = access;
    } else {
      throw new Error(
        `useState recieved invalid access modifier "${access}". ` +
          mustBeOneOfType
      );
    }
  } else {
    throw new Error(
      `useState recieved invalid access modifier type "${typeof access}". ` +
        mustBeOneOfType
    );
  }

  if (accessModifier === 'public') {
    if (typeof key !== 'string' || (typeof key === 'string' && !key.length)) {
      throw new Error(
        'useState requires the key option when referencing public state.'
      );
    }

    return publicStateWorker({ initialState, key, onUpdate, persist });
  } else if (access === 'protected') {
    return protectedStateWorker({ initialState });
  } else {
    return privateStateWorker({ initialState, onUpdate });
  }
}) as IUseStateFunc;
