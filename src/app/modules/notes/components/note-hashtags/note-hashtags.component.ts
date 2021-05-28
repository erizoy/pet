import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'two-todo-note-hashtags',
  templateUrl: './note-hashtags.component.html',
  styleUrls: ['./note-hashtags.component.scss']
})
export class NoteHashtagsComponent {
  @Input() hashtags!: string[];
  @Output() onSave = new EventEmitter<string[]>();
  @ViewChild('hashtagEditor') hashtagEditorRef!: ElementRef;
  readonly separatorKeysCodes = [SPACE, ENTER, COMMA] as const;
  editMode = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if(this.editMode && !this.elementRef.nativeElement.contains(event.target)) {
      this.save();
    }
  }

  constructor(private elementRef: ElementRef) { }

  editHashtags(): void {
    this.editMode = true;
    setTimeout(() => {
      this.hashtagEditorRef.nativeElement.focus();
    }, 0)
  }

  addHashtag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.hashtags.includes(value)) {
      this.hashtags.push(value);
    }

    event.chipInput!.clear();
  }

  removeHashtag(hashtag: string): void {
    this.hashtags = this.hashtags.filter(item => item !== hashtag);
  }

  save(): void {
    this.onSave.emit(this.hashtags);
    this.editMode = false;
  }
}
