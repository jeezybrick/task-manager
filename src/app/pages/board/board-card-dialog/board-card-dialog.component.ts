import {
  Component, ElementRef,
  Inject,
  OnInit, ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Note } from '../../../models/note.model';
import { NoteService } from '../../../shared/services/note.service';
import { finalize } from 'rxjs/internal/operators';

import { AreYouSureDialogComponent } from '../../../shared/components/are-you-sure-dialog/are-you-sure-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { CardService } from '../../../shared/services/card.service';

@Component({
  selector: 'app-board-card-dialog',
  templateUrl: './board-card-dialog.component.html',
  styleUrls: ['./board-card-dialog.component.scss']
})
export class BoardCardDialogComponent implements OnInit {
  public noteName = '';
  public notes: Note[] = [];
  public isNotesLoading = true;
  public isCreateNoteProcess = false;
  public isDeleteNoteProcess = false;
  public isUpdateNoteProcess = false;
  public isShowEditCardNameInput = false;

  @ViewChild('cardNameInput') cardNameInput: ElementRef;

  // получаем данные с выбранной карточки из компонента колонок
  constructor(public dialogRef: MatDialogRef<BoardCardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar,
              private snackBarService: SnackBarService,
              private dialog: MatDialog,
              private cardService: CardService,
              private noteService: NoteService) {
  }

  public ngOnInit() {
    this.getNotes();
  }

  private getNotes(): void {
    this.noteService.getNotes(this.data.card._id).subscribe((response: Note[]) => {

      setTimeout(() => {
        this.notes = response;
        this.isNotesLoading = false;
      }, 500);

    });
  }

  public addNote(): any {

    if (this.isCreateNoteProcess) {
      return;
    }

    this.isCreateNoteProcess = true;

    // передаем имя заметки, id карточки, id колонки в сервис для создания новой заметки
    this.noteService.createNote(this.data.card._id, {name: this.noteName})
      .pipe(finalize(() => setTimeout(() => {
        this.isCreateNoteProcess = false;
      }, 500)))
      .subscribe((response: Note) => {

        // пушим в массив заметок свежесозданную заметку
        this.notes.unshift(response);
        // очищаем поле ввода
        this.noteName = '';

        // пушим в массив заметок карточки свежесозданную заметку
        this.data.card.notes.unshift(response);

        this.isCreateNoteProcess = false;

      });
  }

  public removeNote(noteId: string): void {

    const dialogRef = this.dialog.open(AreYouSureDialogComponent);
    let removedNote;

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        const index = this.notes.findIndex((item) => item._id === noteId);

        if (index > -1) {
          removedNote = this.notes.splice(index, 1)[0];
          this.data.card.notes.splice(index, 1);
        }

        this.snackBarService.showSnackBar('Карточка удалена').subscribe((action: any) => {
          console.log(action);

          if (action.reverse) {
            this.notes.splice(index, 0, removedNote);
            this.data.card.notes.splice(index, 0, removedNote);
            return;
          }

          this.isDeleteNoteProcess = true;

          this.noteService.deleteNote(noteId)
            .subscribe((response: any) => {
              this.isDeleteNoteProcess = false;
            });

        });

      }
    });


  }

  public toggleFavoriteNote(note: Note): void {

    if (this.isUpdateNoteProcess) {
      return;
    }

    note.favorite = !note.favorite;

    this.isUpdateNoteProcess = true;
    const data = {
      'favorite': !note.favorite
    };

    this.noteService.updateNote(note._id, data)
      .subscribe((response: any) => {
        note = response;
        this.isUpdateNoteProcess = false;
      });
  }

  public toggleEditCardNameInput(): void {
    this.isShowEditCardNameInput = !this.isShowEditCardNameInput;

    if (this.isShowEditCardNameInput) {
      setTimeout(() => this.cardNameInput.nativeElement.focus());
    } else {

      this.cardService.updateCard(this.data.card._id, {name: this.data.card.name})
        .subscribe((response: any) => {

        });
    }
  }

}
