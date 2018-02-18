import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {User} from '../_models/user';

@Injectable()
export class AuthService {

  private user: User;
  private token: string;

  constructor(private http: HttpClient,
              private router: Router) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  public static isUserAuthorized() {
    return !!localStorage.getItem('currentUser');
  }

  public static handleError(response) {
    return Observable.throw(response.error || 'server error');
  }

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const data = {username: username, password: password};

    return this.http.post(environment.apiEndpoint + '/login_check', data, {headers : headers})
      .map((response) => {

      const token = response && response.token;
      if (!token) {
        return false;
      }
      this.setToken(token);

      return true;
      }).catch(AuthService.handleError);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  register(name: string, username: string, password: string): Observable<boolean> {
    const data = {name: name, username: username, password: password};
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post<any>(environment.apiEndpoint + '/register', data, {headers : headers})
      .map((response) => {
        const token = response && response.token;
        if (!token) {
          return false;
        }
        this.setToken(token);
      }).catch(AuthService.handleError);
  }

  public setCurrentUser(user: User) {

    this.user = user;
    localStorage.setItem('currentUser', JSON.stringify({user}));

  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

}
