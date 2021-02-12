import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../item';
import {AuthService} from '../../auth/auth.service';
import {UserService} from '../../auth/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ItemService} from '../item.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Input()
  items: Item[];

  @Input()
  isHome: boolean;

  constructor(public authService: AuthService, private userService: UserService, private itemService: ItemService,
              private snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  addToWishlist(id: string): void {
    const wishList = this.authService.userProfile.wishList;
    wishList.push(id);
    this.userService.updateUser({wishList}).subscribe({
      next: value => {
        this.authService.userProfile.wishList = value.wishList;
        this.userService.readWishList().subscribe({
          next: value1 => {
            this.authService.wishList = value1;
            const message = 'Item added to your wishlist!';
            this.snackBar.open(message, 'close', {duration: 5000});
          }
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  removeFromWishlist(id: string): void {
    const wishList = this.authService.userProfile.wishList.filter(el => el !== id);
    this.userService.updateUser({wishList}).subscribe({
      next: value => {
        this.authService.userProfile.wishList = value.wishList;
        this.userService.readWishList().subscribe({
          next: value1 => {
            this.authService.wishList = value1;

            const message = 'Item removed from your wishlist!';
            this.snackBar.open(message, 'close', {duration: 2000});
          }
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  itemIsInList(id: string): boolean {
    return !!this.authService?.wishList.find(el => el._id === id);
  }

  deleteItem(id, i): void {
    this.itemService.deleteItem(id).subscribe({
      next: value => {
        this.items.splice(i, 1);
        const message = 'Item deleted successfully!';
        this.snackBar.open(message, 'close', {duration: 2000});
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
