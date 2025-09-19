import { IQuery } from "../../../domain/cqrs/IQuery";
import {
  PatrimonioNetoOficonRequest,
  PatrimonioNetoOficon,
} from "../../../domain/entities/PatrimonioNetoOficon";
import { v4 as uuid } from "uuid";

export class GetPatrimonioNetoOficonQuery
  implements IQuery<PatrimonioNetoOficon[]>
{
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: PatrimonioNetoOficonRequest) {}
}
