import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

  private token: string;

  constructor(private http: Http) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  public static isUserAuthorized() {
    return !!localStorage.getItem('currentUser');
  }

  private static handleError(error: Response) {
    return Observable.throw(error.json() || 'server error');
  }

  login(username: string, password: string): Observable<boolean> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = {username: username, password: password};

    return this.http.post('http://new/pw-application-old/public/api/login_check', data, {headers : headers})
      .map((response: Response) => {

          return this.setCurrentUser(username, response);
      }).catch(AuthService.handleError);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  register(name: string, username: string, password: string): Observable<boolean> {
    let data = {name: name, username: username, password: password};
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post('http://new/pw-application-old/public/api/register', data, {headers : headers})
      .map((response: Response) => {

        return this.setCurrentUser(username, response);
      }).catch(AuthService.handleError);
  }

  private setCurrentUser(username: string, response: Response) {
    const token = response.json() && response.json().token;
    if (token) {
      this.token = token;
      localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
      return true;
    }
    return false;
  }

}
