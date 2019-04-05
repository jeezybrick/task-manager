import { Base } from './base.model';
import { Column } from './column.model';

export class Board extends Base {
  columns?: Column[];
  createdAt: string;
}
