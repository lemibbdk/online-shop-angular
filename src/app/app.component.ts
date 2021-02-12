import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from './item/cart.service';
import {UserService} from './auth/user.service';
import {ItemService} from './item/item.service';
import {Item} from './item/item';
import {logger} from 'codelyzer/util/logger';
import {ListItemComponent} from './item/list-item/list-item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-online-shop';

  searchValue = '';

  items: Item[];

  disableSearch = true;

  searchOptions = [];

  constructor(public authService: AuthService, private snackBar: MatSnackBar, private router: Router,
              private cartService: CartService, private itemService: ItemService) { }

  logout(): void {
    this.authService.logout().subscribe({
      next: data => {
        this.authService.userProfile = null;
        localStorage.removeItem('user');

        const message = 'You have successfully logged out';
        this.snackBar.open(message, 'close', {duration: 4000});

        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  removeFromCart(i): void {
    const currentCart = this.authService.currentCart;
    currentCart.items.splice(i, 1);
    this.cartService.updateCart(currentCart._id, {items: currentCart.items}).subscribe({
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

  onInput(e): void {
    this.searchValue = e.target.value;
    this.disableSearch = e.target.value === '';

    if (this.disableSearch) {
      this.searchOptions = [];
    } else {
      this.itemService.searchItemNames(e.target.value).subscribe({
        next: value => {
          this.searchOptions = value;
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  searchItems(): void {
    // this.itemService.updateSearchValue(this.searchValue);
    const searchField = document.getElementById('searchField') as HTMLInputElement;
    const values = searchField.value.split(' ');
    let paramValues = '';
    values.forEach((val, i) => {
      paramValues += 'key-' + val;
    });
    console.log(paramValues);
    this.router.navigate(['/search/' + paramValues]);



    // this.itemService.searchItems(this.searchValue).subscribe({
    //   next: value => {
    //     console.log(value);
    //     this.items = value;
    //     this.itemService.updateData(value);
    //     this.itemService.updateSearchValue(this.searchValue);
    //     // this.itemService.announceItems(value);
    //     this.router.navigate(['/items/search']);
    //   }
    // });
  }

  onActivate(componentRef): void {
    // if (componentRef.constructor.name === 'ListItemComponent') {
    //   componentRef.anyFunction();
    //   console.log(this.items);
    //   componentRef.items = this.items;
    // }
    // console.log(componentRef);

    if (componentRef.constructor.name === 'HomeComponent') {
    }
  }
  //
  // onDeactivate() {
  //   console.log('deactivated');
  // }
}
