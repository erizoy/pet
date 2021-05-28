import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list.component';
import { ListFormComponent } from './components/list-form/list-form.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ListRoutingModule } from './list-routing.module';

@NgModule({
  declarations: [
    ListComponent,
    ListFormComponent,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatSnackBarModule
  ]
})
export class ListModule {}
