import { Injectable } from '@angular/core';
import {Item} from './item';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  baseUrl = 'http://localhost:3000';
  // baseUrl = 'http://192.168.0.27:3000';
  // baseUrl = 'https://aleksa-online-shop.herokuapp.com';

  constructor(private http: HttpClient) { }


  createItem(item: Item): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return this.http.post(`${this.baseUrl}/items`, item, {headers});
  }

  readItem(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/items/${id}`);
  }

  updateItem(id: string, data: object): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return this.http.patch(`${this.baseUrl}/items/${id}`, data, {headers});
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }

  uploadItemPicture(id: string, formData: object): Observable<any> {
    return this.http.post(`${this.baseUrl}/items/${id}/picture`, formData);
  }

  readCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/items/categories`);
  }

  readSubCategories(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/items/${category}/subcategories`);
  }

  readItems(subCategory: string, category: string, size: string, page: string, sortBy: string, min: string, max: string, kWords: string): Observable<any> {
    let params = {};
    if (min === '0' && max === '0') {
      params = {limit: size, page, sortBy};
    } else {
      params = {limit: size, page, sortBy, min, max};
    }

    let body = {
      kWords: undefined,
      category: undefined
    };
    if (kWords !== '') {
      body.kWords = kWords;
    }
    if (category !== '') {
      body.category = category;
    }

    if (subCategory === '') {
      subCategory = 'undefined';
    }

    return this.http.post(`${this.baseUrl}/items/subcategories/${subCategory}/all`, body, {params});
  }

  readBestBuyItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/bestBuyItems`);
  }

  readMostFavoriteItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/mostFavoriteItems`);
  }

  readBestRatedItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/bestRatedItems`);
  }

  searchItemNames(value: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/names`, {value});
  }

  // searchItems(kWords: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/items/search`, {kWords});
  // }

}
