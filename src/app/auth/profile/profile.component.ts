import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../auth.service';
import {Cart} from '../../item/cart';
import {CartService} from '../../item/cart.service';
import {CartItem} from '../../item/cartItem';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../../item/item';
import {ItemService} from '../../item/item.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RatingModule} from 'primeng/rating';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  contentToLoad = 'profile';

  toEditUser = 'edit';

  editingProfile = false;

  shoppingHistory: Cart[];

  routeParams = [];

  reviewForm = new FormGroup({
    review: new FormControl('', [Validators.required]),
    evaluation: new FormControl('', [Validators.required])
  });

  evaluationOptions = [1, 2, 3, 4, 5];

  item: Item;

  showReviewForm = false;

  editingCart = false;

  cart: Cart;
  backUpCart: any;
  disableEditingCart = true;

  editFinishedEvent(): void {
    this.editingProfile = false;
  }

  constructor(private route: ActivatedRoute, public authService: AuthService, private cartService: CartService,
              private itemService: ItemService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.backUpCart = {};
    const routePath = this.route.snapshot.routeConfig.path;

    if (routePath.split('/')[1] === undefined) {
      this.contentToLoad = 'profile';
    } else {
      this.contentToLoad = routePath.split('/')[1];
    }

    this.readCarts();

    const currentPage = this.route.snapshot.routeConfig.path.split('/')[1];

    if (currentPage !== 'shoppingHistory'){
      if (this.cart) {
        this.resetCart();
      }
    }

  }

  readCarts(): void {
    this.cartService.readCarts().subscribe({
      next: value => {
        this.shoppingHistory = value.slice(0, -1);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  confirmReceived(cart): void {
    cart.items.forEach((cartItem, i) => {
      const item = cartItem.item;
      item.remaining -= cartItem.quantity;

      this.itemService.updateItem(item._id, {remaining: item.remaining}).subscribe({
        next: value => {
          if (i === cart.items.length - 1) {
            this.cartService.updateCart(cart._id, {status: 'confirmed'}).subscribe({
              next: value1 => {
                this.readCarts();
              },
              error: err => {
                console.log(err);
              }
            });
          }
        }
      });
    });
  }

  reviewItem(item, i, j): void {
    this.item = item;
    this.showReviewForm = true;

    const targetForm = document.getElementById('form-' + i + '-item' + j);
    targetForm.classList.remove('d-none');
  }

  cancelReview(i, j): void {
    this.showReviewForm = false;
    const targetForm = document.getElementById('form-' + i + '-item' + j);
    targetForm.classList.add('d-none');
  }

  onSubmit(i, j): void {
    const targetForm = document.getElementById('form-' + i + '-item' + j);

    this.item.reviews.push({user: this.authService.userProfile._id, name: this.authService.userProfile.name, ...this.reviewForm.value});
    this.itemService.updateItem(this.item._id, {reviews: this.item.reviews}).subscribe({
      next: value => {
        this.showReviewForm = false;
        targetForm.classList.add('d-none');

        const message = 'You have successfully reviewed order!';
        this.snackBar.open(message, 'close', {duration: 4000});
      },
      error: err => {
        console.log(err);
      }
    });
  }

  itemReviewed(cartItem): boolean {
    return !!cartItem.item.reviews.find(el => el.user === this.authService.userProfile._id);
  }

  cancelOrder(el): void {
    this.cartService.updateCart(el._id, {status: 'canceled'}).subscribe({
      next: value1 => {
        this.readCarts();
        const message = 'You have successfully canceled your order!';
        this.snackBar.open(message, 'close', {duration: 4000});
      },
      error: err => {
        console.log(err);
      }
    });
  }

  editOrder(el): void {
    this.editingCart = true;
    this.disableEditingCart = true;
    this.cart = el;
    this.backUpCart = JSON.parse(JSON.stringify(el.items));
  }

  cancelEditingOrder(): void {
    this.editingCart = false;
    this.resetCart();
  }

  toArrayFunction(num): any {
    return Array.from({length: num}, (_, i) => i + 1);
  }

  updatePrices(e, i): void {
    this.disableEditingCart = false;

    this.cart.items[i].quantity = Number(e.value);
    this.cartService.updateCart(this.cart._id, {items: this.cart.items}).subscribe({
      next: value => {
        this.cart = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  finishEditingOrder(): void {
    this.editingCart = false;

    const message = 'Successfully edited cart';
    this.snackBar.open(message, 'close', {duration: 2000});
  }

  resetCart(): void {
    this.cartService.updateCart(this.cart._id, {items: this.backUpCart}).subscribe({
      next: value => {
        this.readCarts();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cart) {
      this.resetCart();
    }
  }

}
