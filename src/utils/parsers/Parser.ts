/* eslint-disable prettier/prettier */
export interface Parser<T> {
  // eslint-disable-next-line no-empty-pattern
  execute({ }): Promise<Array<T>>;
}
