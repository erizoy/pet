import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BaseComponent } from './components/base/base.component';
import { SwipeDirective } from './directives/swipe.directive';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    BaseComponent,
    SwipeDirective,
    InfoModalComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  exports: [
    BaseComponent,
    SwipeDirective,
    SafeHtmlPipe
  ],
  providers: [{
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: { duration: 3000 }
  }]
})
export class SharedModule {}
