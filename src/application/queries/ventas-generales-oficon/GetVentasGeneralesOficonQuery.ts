import { IQuery } from "../../../domain/cqrs/IQuery";
import {
  VentasGeneralesOficonRequest,
  VentasGeneralesOficon,
} from "../../../domain/entities/VentasGeneralesOficon";
import { v4 as uuid } from "uuid";

export class GetVentasGeneralesOficonQuery
  implements IQuery<VentasGeneralesOficon[]>
{
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: VentasGeneralesOficonRequest) {}
}
