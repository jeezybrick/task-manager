import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.scss']
})
export class AreYouSureDialogComponent {

  constructor(public dialogRef: MatDialogRef<AreYouSureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
