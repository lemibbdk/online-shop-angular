import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UserService} from '../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {User} from '../user';
import {CartService} from '../../item/cart.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(11)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    place: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    role: new FormControl('')
  });

  val: string;

  @Input()
  toEditUser: string;

  @Output()
  newItemEvent = new EventEmitter<string>();

  constructor(private userService: UserService, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    if (this.toEditUser) {
      this.signupForm.get('password').clearValidators();
      Object.keys(this.authService.userProfile).forEach(name => {
        if (this.signupForm.controls[name]) {
          this.signupForm.controls[name].patchValue(this.authService.userProfile[name]);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.toEditUser) {
      if (this.signupForm.get('password').value === '') {
        this.signupForm.removeControl('password');
      }

      const dataToSend = {...this.signupForm.value};
      delete dataToSend.role;
      dataToSend.role = this.signupForm.get('role').value ? 'admin' : 'user';

      this.userService.updateUser(dataToSend).subscribe({
        next: data => {
          delete data.currentCart;
          data.currentCart = this.authService.currentCart;
          this.authService.userProfile = data;

          const message = 'You have successfully updated your profile';
          this.snackBar.open(message, 'close', {duration: 4000});
        },
        error: err => {
          console.log(err);
        }
      });
      this.newItemEvent.emit();
    } else {
      const dataToSend = {...this.signupForm.value};
      delete dataToSend.role;
      dataToSend.role = this.signupForm.get('role').value ? 'admin' : 'user';
      this.userService.createUser(dataToSend).subscribe({
        next: data => {
          const message = 'You have successfully signed up';
          this.snackBar.open(message, 'close', {duration: 4000});

          this.router.navigate(['/login']).then(d => d);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }


}
