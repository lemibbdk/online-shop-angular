import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {UserService} from '../../auth/user.service';
import {CartService} from '../cart.service';
import {Cart} from '../cart';
import {User} from '../../auth/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {forkJoin} from 'rxjs';
import {ItemService} from '../item.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class CartComponent implements OnInit {

  cart: Cart;
  user: User;

  confirmationControl = new FormControl('', [
    Validators.required,
    Validators.requiredTrue
  ]);

  placesNotMatched: any;

  purchaseSuccess = false;
  purchaseReview = false;

  selectedQuantity: string;

  arrayNumber = [];

  constructor(public authService: AuthService, private userService: UserService, private cartService: CartService,
              private itemService: ItemService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // this.userService.readUser().subscribe({
    //   next: value => {
    //     this.user = value
    //
    //     this.cartService.readCart(value.currentCart._id).subscribe({
    //       next: value1 => {
    //         this.cart = value1;
    //
    //         this.placesNotMatched = this.cart.items.find(el => el.item.locatedIn !== this.user.place);
    //       },
    //       error: err => {
    //         console.log(err)
    //       }
    //     })
    //   }
    // })

    this.placesNotMatched = this.authService.currentCart?.items.find(el => el.item.locatedIn !== this.authService.userProfile.place);

  }

  toArrayFunction(num): any {
    return Array.from({length: num}, (_, i) => i + 1);
  }

  updatePrices(e, i): void {
    this.authService.currentCart.items[i].quantity = Number(e.value);
    this.cartService.updateCart(this.authService.currentCart._id, {items: this.authService.currentCart.items}).subscribe({
      next: value => {
        this.authService.currentCart = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  decrease(el, i): void {
    el.quantity--;
    this.authService.currentCart.items[i] = el;

    this.cartService.updateCart(this.authService.currentCart._id, {items: this.authService.currentCart.items}).subscribe({
      next: value => {
        this.authService.currentCart = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  increase(el, i): void {
    el.quantity++;

    this.authService.currentCart.items[i] = el;

    this.cartService.updateCart(this.authService.currentCart._id, {items: this.authService.currentCart.items}).subscribe({
      next: value => {
        this.authService.currentCart = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  deleteItemFromCart(i): void {
    this.authService.currentCart.items.splice(i, 1);
    this.cartService.updateCart(this.authService.currentCart._id, {items: this.authService.currentCart.items}).subscribe({
      next: value => {
        this.authService.currentCart = value;
        const message = 'Item removed from cart';
        this.snackBar.open(message, 'close', {duration: 2000});
      },
      error: err => {
        console.log(err);
      }
    });
  }

  proceed(): void {
    this.purchaseReview = true;

    this.cartService.createCart().subscribe({
      next: value1 => {
        this.authService.userProfile.currentCart = value1._id;
        this.authService.currentCart = value1;
        this.userService.updateUser({currentCart: value1._id}).subscribe({
          next: value2 => {
            this.authService.userProfile = value2;
            this.purchaseSuccess = true;
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
