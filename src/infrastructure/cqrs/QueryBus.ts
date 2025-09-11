import { injectable } from "inversify";
import { IQuery } from "../../domain/cqrs/IQuery";
import { IQueryHandler } from "../../domain/cqrs/IQueryHandler";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";

@injectable()
export class QueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<any, any>>();

  async execute<T extends IQuery, TResult>(query: T): Promise<TResult> {
    const queryType = query.constructor.name;
    console.log(`🔍 QueryBus.execute - Query type: ${queryType}`);
    console.log(
      `🔍 QueryBus.execute - Available handlers:`,
      Array.from(this.handlers.keys())
    );
    const handler = this.handlers.get(queryType);

    if (!handler) {
      console.error(`❌ No handler registered for query: ${queryType}`);
      throw new Error(`No handler registered for query: ${queryType}`);
    }

    console.log(`✅ Handler found for query: ${queryType}`);
    return await handler.handle(query);
  }

  register<T extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<T, TResult>
  ): void {
    console.log(`🔧 QueryBus.register - Registering handler for: ${queryType}`);
    this.handlers.set(queryType, handler);
    console.log(
      `✅ QueryBus.register - Handler registered. Total handlers: ${this.handlers.size}`
    );
  }
}
