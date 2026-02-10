export interface IUseCase<T, P> {
  execute(params: P): Promise<T>;
}

/** Use for use-cases that take no parameters. */
export class NoParams {}
