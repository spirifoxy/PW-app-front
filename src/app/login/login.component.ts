import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  error: string;

  constructor( private router: Router,
               private authenticationService: AuthService,
               private userService: UserService) {}

  ngOnInit() {
    if (AuthService.isUserAuthorized()) {
      this.router.navigate(['/transactions']);
    }
  }


  login(e) {

    e.preventDefault();

    this.authenticationService.login(this.username, this.password)
      .subscribe(result => {

        console.log(result);
        this.userService.get.currentUser()
          .then(user => {

            if (user.user_account.status === 1) {
              this.error = 'You have been banned';
              return;
            }

            this.authenticationService.setCurrentUser(user);
            this.router.navigate(['/transactions']);

          });
      }, loginError => this.error = loginError.message);
  }

}
