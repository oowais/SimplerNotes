import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Note } from '../model/note';

@Component({
  selector: 'note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent implements OnInit {
  spinner: boolean = false;

  constructor(
    private service: SharedService,
    private dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public note: Note) { }

  ngOnInit() {
  }

  save(id: number, heading: string, noteText: string) {
    undefined == id ? this.newNote(heading, noteText) : this.editNote(id, heading, noteText);
  }

  editNote(id: number, heading: string, noteText: string): void {
    if (!this.validate(heading, noteText)) {
      this.service.alert('Enter some text', true);
      return;
    }
    this.spinner = true;
    this.service.editNote(id, heading, noteText).subscribe(
      res => {
        if (res.success == true) {
          this.service.alert('Note updated', false);
          this.spinner = false;
          this.close();
        }
      })
  }

  newNote(heading: string, noteText: string): void {
    if (!this.validate(heading, noteText)) {
      this.service.alert('Enter some text', true);
      return;
    }
    this.spinner = true;
    this.service.addNote(heading, noteText).subscribe(
      res => {
        if (res.success == true) {
          this.service.alert('Note saved', false);
          this.spinner = false;
          this.close();
        }
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  validate(heading: string, noteText: string): boolean {
    let isValid: boolean = false;
    if (undefined != noteText) {
      if (noteText.trim().length > 0) {
        isValid = true;
      }
    }

    if (undefined != heading) {
      if (heading.trim().length > 0) {
        isValid = true;
      }
    }
    return isValid;
  }

  deleteNote(id: number): void {
    this.service.triggerDeleteNote(id);
    this.close();
  }
}
