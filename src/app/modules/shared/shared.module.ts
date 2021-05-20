import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './components/base/base.component';
import { SwipeDirective } from './directives/swipe.directive';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    BaseComponent,
    SwipeDirective,
    InfoModalComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    BaseComponent,
    SwipeDirective
  ]
})
export class SharedModule {}
