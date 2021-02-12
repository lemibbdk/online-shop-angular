import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LoginComponent} from './auth/login/login.component';
import {AddItemComponent} from './item/add-item/add-item.component';
import {ProfileComponent} from './auth/profile/profile.component';
import {ItemComponent} from './item/item.component';
import {CartComponent} from './item/cart/cart.component';
import {ListItemComponent} from './item/list-item/list-item.component';


const routes: Routes = [
  { path: '', pathMatch: 'prefix', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/wishlist', component: ProfileComponent },
  { path: 'profile/shoppingHistory', component: ProfileComponent },
  { path: 'items/add', component: AddItemComponent },
  { path: 'items/all/:id/edit', component: AddItemComponent },
  { path: 'items/all/:id', component: ItemComponent },
  { path: 'items/:category', component: HomeComponent },
  // { path: 'items/Computer', component: HomeComponent },
  // { path: 'items/Test', component: HomeComponent },
  { path: 'search', component: HomeComponent },
  { path: 'search/:term', component: HomeComponent },
  { path: 'items/:category/:subCategory', component: HomeComponent },
  { path: 'cart', component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
