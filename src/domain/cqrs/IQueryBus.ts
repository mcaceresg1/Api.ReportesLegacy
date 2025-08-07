import { IQuery } from './IQuery';
import { IQueryHandler } from './IQueryHandler';

export interface IQueryBus {
  execute<T extends IQuery, TResult>(query: T): Promise<TResult>;
  register<T extends IQuery, TResult>(queryType: string, handler: IQueryHandler<T, TResult>): void;
}
