import { Component, OnInit } from '@angular/core';
import { Note } from '../model/note';
import { SharedService } from '../shared/shared.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  emptyNotes: boolean = false;

  constructor(
    private service: SharedService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.startReceivingEvents();
    this.service.changePage(location.pathname);
    this.getAllNotes();
    this.filterNotes();
  }

  startReceivingEvents() {
    this.service.currentDeleteNote.subscribe(id => {
      if (0 != id)
        this.delete(id);
    });
  }

  /**
   * @ngdoc function
   * @name filterNotes
   * @description Get method to fetch notes according to filter
   */
  filterNotes() {
    this.service.currentSearchValue.subscribe(val => {
      if ("" != val)
        this.service.getFilteredNotes(val).subscribe(
          data => {
            this.notes = data;
          }
        );
      else this.getAllNotes();
    });
  }

  /**
   * @ngdoc function
   * @name getAllNotes
   * @description Get method to fetch all notes from server
   */
  public getAllNotes(): void {
    this.service.getAllNotes().subscribe(
      data => {
        data.length > 0 ? this.emptyNotes = false : this.emptyNotes = true;
        this.notes = data;
      },
      err => console.log(err));
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if ('delete' == result) {
        this.service.deleteById(id).subscribe(
          msg => {
            if (true == msg.success) {
              this.service.alert('Note deleted!', false);
              this.getAllNotes();
            }
            else
              this.service.alert(msg, true);
          },
          err => {
            console.log(err);
          }
        );
      }
    });
  }

  edit(id: number, heading: string, text: string, last_edited: string) {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      data: { id: id, heading: heading, note_text: text, last_edited: last_edited }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllNotes();
    });
  }

}
