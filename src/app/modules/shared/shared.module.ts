import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './components/base/base.component';
import { SwipeDirective } from './directives/swipe.directive';

@NgModule({
  declarations: [
    BaseComponent,
    SwipeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BaseComponent,
    SwipeDirective
  ]
})
export class SharedModule {}
