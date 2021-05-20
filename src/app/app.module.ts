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
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { ListsComponent } from './components/lists/lists.component';
import { MatListModule } from '@angular/material/list';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from './modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MatInputModule } from '@angular/material/input';
import { MainComponent } from './components/main/main.component';
import { MatIconModule } from '@angular/material/icon';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ListFormComponent } from './components/list-form/list-form.component';

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
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
