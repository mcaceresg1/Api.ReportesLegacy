import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuidv4 } from "uuid";

export class GetEmpresasOfliplanQuery implements IQuery {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor() {
    this.queryId = uuidv4();
    this.timestamp = new Date();
  }
}
