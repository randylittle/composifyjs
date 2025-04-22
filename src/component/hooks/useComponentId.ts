import { getHash, IGetHashOptions } from 'src/utils';

export const useComponentId = (id?: string, options?: IGetHashOptions) => ({
  id: id ?? getHash(options),
});
