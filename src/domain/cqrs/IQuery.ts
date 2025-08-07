export interface IQuery<TResult = any> {
  readonly queryId: string;
  readonly timestamp: Date;
}
