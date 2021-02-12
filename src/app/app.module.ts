import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {httpInterceptorProviders} from './http-interceptors';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ItemComponent } from './item/item.component';
import { AddItemComponent } from './item/add-item/add-item.component';
import { AddItemPictureComponent } from './item/add-item-picture/add-item-picture.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { CartComponent } from './item/cart/cart.component';
import {AuthService} from './auth/auth.service';
import {UserService} from './auth/user.service';
import {ItemService} from './item/item.service';
import {CartService} from './item/cart.service';
import { ListItemComponent } from './item/list-item/list-item.component';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {PrimengModule} from './primeng.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ItemComponent,
    AddItemComponent,
    AddItemPictureComponent,
    ProfileComponent,
    CartComponent,
    ListItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    PrimengModule,
    MatAutocompleteModule
  ],
  providers: [httpInterceptorProviders, AuthService, UserService, ItemService, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
