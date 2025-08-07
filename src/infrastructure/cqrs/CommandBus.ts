import { injectable } from 'inversify';
import { ICommand } from '../../domain/cqrs/ICommand';
import { ICommandHandler } from '../../domain/cqrs/ICommandHandler';
import { ICommandBus } from '../../domain/cqrs/ICommandBus';

@injectable()
export class CommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<any, any>>();

  async execute<T extends ICommand, TResult = void>(command: T): Promise<TResult> {
    const commandType = command.constructor.name;
    const handler = this.handlers.get(commandType);

    if (!handler) {
      throw new Error(`No handler registered for command: ${commandType}`);
    }

    return await handler.handle(command);
  }

  register<T extends ICommand>(commandType: string, handler: ICommandHandler<T>): void {
    this.handlers.set(commandType, handler);
  }
}
