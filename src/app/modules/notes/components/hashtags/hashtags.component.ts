import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoteService } from '../../../shared/services/note/note.service';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Hashtag } from '../../../../models/hashtag';

@Component({
  selector: 'two-todo-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.scss']
})
export class HashtagsComponent extends BaseComponent implements OnInit {
  @Output() onSelect = new EventEmitter<string[]>();
  hashtags$ = new BehaviorSubject<Hashtag[]>([]);
  selected = false;

  constructor(
    private noteService: NoteService
  ) {
    super();
  }

  ngOnInit(): void {
    this.noteService.hashtags$.pipe(takeUntil(this.destroy$)).subscribe(hashtags => {
      this.hashtags$.next(hashtags.map(hashtag => new Hashtag(hashtag)));
    });
  }

  select(hashtag: Hashtag): void {
    hashtag.toggle();
    const hashtags: string[] = this.hashtags$.getValue()
      .filter(hashtag => hashtag.selected)
      .map(hashtag => hashtag.value);
    this.selected = hashtags.length > 0;
    this.onSelect.emit(hashtags)
  }

  clear(): void {
    this.hashtags$.getValue()
      .forEach(hashtag => hashtag.selected = false);
    this.selected = false;
    this.onSelect.emit([]);
  }

}
