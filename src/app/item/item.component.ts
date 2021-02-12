import {Component, OnInit} from '@angular/core';
import {CartService} from './cart.service';
import {AuthService} from '../auth/auth.service';
import {Item} from './item';
import {ItemService} from './item.service';
import {ActivatedRoute} from '@angular/router';
import {Cart} from './cart';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  quantity = [];

  selectedQuantity = '1';

  item: Item;
  calculatedPrice: string;

  evaluationOptions = [1, 2, 3, 4, 5];

  reviewForm = new FormGroup({
    review: new FormControl('', [Validators.required]),
    evaluation: new FormControl('', [Validators.required])
  });

  itemEvaluation = 0;

  constructor(public authService: AuthService, private cartService: CartService, private itemService: ItemService,
              private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.itemService.readItem(this.route.snapshot.paramMap.get('id')).subscribe({
      next: value => {
        this.item = value;
        this.calculatedPrice = (this.item.price - (this.item.price * this.item.discount / 100)).toFixed(2);
        this.quantity = Array.from({length: value.remaining}, (_, i) => i + 1);
        // this.itemEvaluation = this.getItemEvaluation();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  itemInCartCheck(): boolean {
    if (this.authService.currentCart?.items) {
      return !!this.authService.currentCart.items.find(el => el.item._id === this.item._id);
    }

    return false;
  }

  addToCart(): void {
    const cart = this.authService.currentCart;
    cart.items.push({
      item: this.item, quantity: Number(this.selectedQuantity), currentPrice: this.item.price, currentDiscount: this.item.discount
    });
    this.cartService.updateCart(this.authService.currentCart._id, {items: cart.items}).subscribe({
      next: value => {
        this.authService.currentCart = value;
        const message = 'Item added to cart';
        this.snackBar.open(message, 'close', {duration: 2000});
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // isItemPurchased(): boolean {
  //   if (!this.authService?.shoppingHistory || !this.item?._id) {
  //     return false;
  //   }
  //
  //   return !!this.authService.shoppingHistory.map((el: Cart) => el.items).reduce((accum, item) => {
  //     accum = [...accum, ...item];
  //     return accum;
  //   }, []).find(el => el.item._id === this.item._id);
  // }

  getItemEvaluation(): number {
    let sumEvaluation = 0;
    this.item.reviews.forEach((el: any) => {
      sumEvaluation += Number(el.evaluation);
    });

    return (sumEvaluation / this.item.reviews.length);
  }

}
