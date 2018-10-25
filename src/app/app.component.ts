import { Component } from '@angular/core';
// import note class & note service
import { Note } from './note';
import { NotesService } from './notes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  errMessage: string;
  note: Note = new Note();
  notes: Array<Note> = [];
  // DI of note service
  constructor(private notesService: NotesService) { }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // load all notes on app load
    this.notesService.getNotes().subscribe(
      data => this.notes = data,
      err => console.log(err)
    );
  }
  // submit event - posting note data
  takeNote() {
    // check input field length to proceed with saving
    if (this.note.text.length === 0 || this.note.title.length === 0) {
      this.errMessage = 'Both the fields are required';
    } else {
      // optimistic load - update UI first, later save to DB
      this.notes.push(this.note);
      this.notesService.addNote(this.note).subscribe(
        data => { },
        err => {
          const index: number = this.notes.findIndex(
            note => note.title === this.note.title
          );
          this.notes.splice(index, 1);
          this.errMessage = 'An error occurred while saving note.';
        }
      );
      this.note = new Note();
    }
  }
}
