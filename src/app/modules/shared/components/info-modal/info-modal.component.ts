import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: 'info-modal.component.html',
  styleUrls: ['info-modal.component.scss']
})
export class InfoModalComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  close(): void {
    this.dialogRef.close();
  }

  reload(): void {
    window.location.reload();
  }

}
