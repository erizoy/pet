import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { NotesComponent } from './notes.component';
import { HashtagsComponent } from './components/hashtags/hashtags.component';
import { NotesRoutingModule } from './notes-routing.module';
import { NoteComponent } from './components/note/note.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoteHashtagsComponent } from './components/note-hashtags/note-hashtags.component';

@NgModule({
  declarations: [
    NotesComponent,
    HashtagsComponent,
    NoteComponent,
    NoteHashtagsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NotesRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    FormsModule,
    MatInputModule
  ]
})
export class NotesModule { }
