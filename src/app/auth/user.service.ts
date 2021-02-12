import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://localhost:3000';
  // baseUrl = 'http://192.168.0.27:3000';
  // baseUrl = 'https://aleksa-online-shop.herokuapp.com';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return this.http.post(`${this.baseUrl}/users`, user, {headers});
  }

  readUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/me`);
  }

  updateUser(data: object): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return this.http.patch(`${this.baseUrl}/users/me`, data, {headers});
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/me`);
  }

  readWishList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/wishList`);
  }
}
