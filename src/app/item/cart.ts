import {User} from '../auth/user';
import {CartItem} from './cartItem';

export interface Cart {
  _id: string;
  items: CartItem[];
  owner?: User;
  overAllPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
