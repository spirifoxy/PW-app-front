import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    if (localStorage.getItem('currentUser')) {
      console.log( JSON.parse(localStorage.getItem('currentUser')).username );
      return true;
    }
    console.log(localStorage.getItem('currentUser'));
    this.router.navigate(['/login']);
    return false;
  }

}
