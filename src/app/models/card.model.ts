import { Note } from './note.model';
import { Base } from './base.model';

export class Card extends Base {
  notes: Note[];
  position: number;
  columnId: string;
}
