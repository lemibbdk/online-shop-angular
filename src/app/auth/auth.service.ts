import { Injectable } from '@angular/core';
import {User} from './user';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from './user.service';
import {CartService} from '../item/cart.service';
import {Cart} from '../item/cart';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:3000';
  // baseUrl = 'http://192.168.0.27:3000';
  // baseUrl = 'https://aleksa-online-shop.herokuapp.com';

  userProfile: User;

  wishList = [];
  currentCart: Cart;
  shoppingHistory: [];

  constructor(private http: HttpClient, private userService: UserService, private cartService: CartService) {
    const loggedIn = this.isLoggedIn();

    if (loggedIn) {
      this.userService.readUser().subscribe({
        next: data => {
          this.userProfile = data;
          this.cartService.readCart(data.currentCart).subscribe({
            next: value => {
              this.currentCart = value;
            },
            error: err => {
              console.log(err);
            }
          });

          this.userService.readWishList().subscribe({
            next: value => {
              this.wishList = value;
            }
          });

          this.cartService.readCarts().subscribe({
            next: value => {
              this.shoppingHistory = value;
            },
            error: err => {
              console.log(err);
            }
          });
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  login(data: object): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return this.http.post(`${this.baseUrl}/users/login`, data, {headers});
  }

  logout(): Observable<any> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.post(`${this.baseUrl}/users/logout`, this.userProfile, {headers});
  }

  logoutAll(): Observable<any> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.post(`${this.baseUrl}/users/logoutAll`, {}, {headers});
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
