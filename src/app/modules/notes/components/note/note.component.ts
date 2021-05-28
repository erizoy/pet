import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NoteService } from '../../../shared/services/note/note.service';
import { Note } from '../../../../models/note';

@Component({
  selector: 'two-todo-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  @Input() note!: Note;
  @ViewChild('noteContent', { static: true }) noteContent!: ElementRef;
  edit = false;

  constructor(
    public noteService: NoteService,
    private cdRef: ChangeDetectorRef
  ) {}

  focusNote(): void {
    const noteContent = this.noteContent.nativeElement;

    noteContent.contentEditable = 'true';
    noteContent.focus();
    this.edit = true;

    this.cdRef.detectChanges();
  }

  blurNote(): void {
    const noteContent = this.noteContent.nativeElement;
    const text = noteContent.innerText;

    this.noteService.update(this.note.uuid, { text });
    this.edit = false;

    noteContent.removeAttribute('contenteditable');
    noteContent.blur();
  }

  preventEdit(event: MouseEvent): void {
    event.stopPropagation();
  }

  stripHtml(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }

  saveHashtags(hashtags: string[]): void {
    this.noteService.update(this.note.uuid, { hashtags });
  }
}
