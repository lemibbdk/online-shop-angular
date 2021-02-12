import {Item} from './item';

export interface CartItem {
  item: Item;
  calculatedPrice?: number;
  currentPrice: number;
  currentDiscount: number;
  quantity: number;
  status?: string;
}
