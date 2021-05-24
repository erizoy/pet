import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './modules/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MainComponent } from './components/main/main.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { ListsComponent } from './components/lists/lists.component';
import { MatListModule } from '@angular/material/list';
import { ListComponent } from './components/list/list.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ListFormComponent } from './components/list-form/list-form.component';
import { APP_CONFIG, TWO_TODO_CONFIG } from './models/app-config';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UserMenuComponent,
    ListsComponent,
    ListComponent,
    LoginFormComponent,
    MainComponent,
    TaskFormComponent,
    ListFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    NoopAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    DragDropModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [{
    provide: APP_CONFIG,
    useValue: TWO_TODO_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
