import {Cart} from '../item/cart';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  address: string;
  place: string;
  role: 'user' | 'admin';
  currentCart: Cart;
  wishList: any;
}
