import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import {CartService} from '../../item/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
  });

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: data => {
        this.authService.userProfile = data.user;

        this.authService.currentCart = data.user.currentCart;
        this.authService.wishList = data.user.wishList;

        const userLocalStorage = {
          id_token: data.token,
          userId: data.user._id,
        };

        localStorage.setItem('user', JSON.stringify(userLocalStorage));

        const message = 'You have successfully logged in';
        this.snackBar.open(message, 'close', {duration: 4000});

        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
        const message = 'Invalid email or password';
        this.snackBar.open(message, 'close', {duration: 4000, panelClass: ['red-snackbar']});
      }
    })
  }

}
