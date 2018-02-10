import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {AuthService} from './auth.service';
import { AuthGuard } from './auth.guard';
import { TransactionsComponent } from './transactions/transactions.component';


const routes: Routes = [
  {path: '', component : AppComponent},
  {path: 'login', component : LoginComponent},
  {path: 'transactions', component: TransactionsComponent, canActivate : [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
