export interface IGetHashOptions {
  length?: number;
  prefix?: string;
}

export const getHash = (options?: IGetHashOptions): string =>
  (options?.prefix ?? '') +
  new Array(options?.length ?? 8)
    .fill(undefined)
    .map(() => Math.max(0, Math.trunc(Math.random() * 16.4) - 1).toString(16))
    .join('');
