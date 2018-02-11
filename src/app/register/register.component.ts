import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  name: string;
  username: string;
  password: string;
  password_confirm: string;
  error: string;

  constructor( private router: Router,
               private authenticationService: AuthService) {}

  ngOnInit() {
    if (AuthService.isUserAuthorized()) {
      this.router.navigate(['/transactions']);
    }
  }

  register(e) {

    e.preventDefault();

    this.error =  '';
    if (this.password && !this.password_confirm) {
      this.error = 'Confirm your password';
      return;
    }
    if (this.password !== this.password_confirm) {
      this.error = 'Passwords are not equal';
      return;
    }

    this.authenticationService.register(this.name, this.username, this.password)
      .subscribe(result => {

        this.router.navigate(['/transactions']);

      }, registerError => this.error = registerError.message);

  }

}
