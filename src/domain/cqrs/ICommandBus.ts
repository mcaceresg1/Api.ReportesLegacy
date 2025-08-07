import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

export interface ICommandBus {
  execute<T extends ICommand, TResult = void>(command: T): Promise<TResult>;
  register<T extends ICommand>(commandType: string, handler: ICommandHandler<T>): void;
}
