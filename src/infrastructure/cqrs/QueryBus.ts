import { injectable } from 'inversify';
import { IQuery } from '../../domain/cqrs/IQuery';
import { IQueryHandler } from '../../domain/cqrs/IQueryHandler';
import { IQueryBus } from '../../domain/cqrs/IQueryBus';

@injectable()
export class QueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<any, any>>();

  async execute<T extends IQuery, TResult>(query: T): Promise<TResult> {
    const queryType = query.constructor.name;
    const handler = this.handlers.get(queryType);

    if (!handler) {
      throw new Error(`No handler registered for query: ${queryType}`);
    }

    return await handler.handle(query);
  }

  register<T extends IQuery, TResult>(queryType: string, handler: IQueryHandler<T, TResult>): void {
    this.handlers.set(queryType, handler);
  }
}
