import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AuthGuard} from '../auth.guard';

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
               private authenticationGuard: AuthGuard) {}

  ngOnInit() {
    this.authenticationService.logout(); // TODO remove that
    if (AuthService.isUserAuthorized()) {
      this.router.navigate(['/transactions']);
    }
  }


  login(e) {

    e.preventDefault();


    this.authenticationService.login(this.username, this.password)
      .subscribe(result => {

        console.log(result);
        this.router.navigate(['/transactions']);

      }, loginError => this.error = loginError.message);


  }

}
