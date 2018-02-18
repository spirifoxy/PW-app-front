import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {User} from './_models/user';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  currentUser: User;
  token: string;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

     this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
     this.token = localStorage.getItem('token');

    if (this.token && this.currentUser) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
