import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cart} from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = 'http://localhost:3000';
  // baseUrl = 'http://192.168.0.27:3000';
  // baseUrl = 'https://aleksa-online-shop.herokuapp.com';

  constructor(private http: HttpClient) { }

  createCart(): Observable<any> {
    return this.http.post(`${this.baseUrl}/carts`, {items: [], overAllPrice: 0});
  }

  readCart(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/carts/${id}`);
  }

  readCarts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/carts`);
  }

  updateCart(id: string, data: object): Observable<any> {
    return this.http.patch(`${this.baseUrl}/carts/${id}`, data);
  }

  deleteCart(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/carts/${id}`);
  }
}
