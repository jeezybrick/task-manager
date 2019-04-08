import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Note } from '../../../models/note.model';
import { NoteService } from '../../../shared/services/note.service';
import { finalize } from 'rxjs/internal/operators';
import { AreYouSureDialogComponent } from '../../../shared/components/are-you-sure-dialog/are-you-sure-dialog.component';

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

  // получаем данные с выбранной карточки из компонента колонок
  constructor(public dialogRef: MatDialogRef<BoardCardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
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
      .pipe(finalize(() => setTimeout(() => {this.isCreateNoteProcess = false; }, 500)))
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isDeleteNoteProcess) {
          return;
        }

        this.isDeleteNoteProcess = true;

        this.noteService.deleteNote(noteId)
          .pipe(finalize(() => setTimeout(() => {
            this.isCreateNoteProcess = false;
          }, 1000)))
          .subscribe((response: any) => {
            const index = this.notes.findIndex((item) => item._id === noteId);

            if (index > -1) {
              this.notes.splice(index, 1);
            }

            this.isDeleteNoteProcess = false;
          });
      }
    });


  }

}
