import { Component, QueryList, ViewChildren } from '@angular/core';
import { take } from 'rxjs/operators';
import { NoteComponent } from './components/note/note.component';
import { NoteService } from '../shared/services/note/note.service';

@Component({
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  @ViewChildren(NoteComponent) noteComponents!: QueryList<NoteComponent>;

  constructor(
    public noteService: NoteService
  ) {}

  filterNotes(hashtags: string[]) {
    this.noteService.filter(hashtags);
  }

  create(): void {
    this.noteService.create();
    this.noteComponents.changes.pipe(take(1)).subscribe((noteComponents: QueryList<NoteComponent>) => {
      noteComponents.get(0)?.focusNote();
    })
  }
}
