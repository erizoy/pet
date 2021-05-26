import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NotesComponent } from './notes.component';
import { HashtagsComponent } from './components/hashtags/hashtags.component';
import { NotesRoutingModule } from './notes-routing.module';

@NgModule({
  declarations: [
    NotesComponent,
    HashtagsComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    SharedModule
  ]
})
export class NotesModule { }
