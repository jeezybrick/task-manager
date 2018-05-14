import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatToolbarModule,
  MatMenuModule,
  MatTabsModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DynamicFormModule } from './dynamic-form';
import { AuthModule } from './auth';
import { AdminModule } from './admin/admin.module';
import { AddHeaderInterceptor } from './header-interceptor';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { SchemaComponent } from './schema/schema.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SchemaComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    DynamicFormModule,
    AuthModule,
    AppRoutingModule,
    AdminModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AddHeaderInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }