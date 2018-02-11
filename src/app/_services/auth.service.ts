import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthService {

  private token: string;

  constructor(private http: HttpClient) {
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
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    let data = {username: username, password: password};

    return this.http.post(environment.apiEndpoint + '/login_check', data, {headers : headers})
      .map((response) => {

          return this.setCurrentUser(username, response);
      }).catch(AuthService.handleError);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  register(name: string, username: string, password: string): Observable<boolean> {
    let data = {name: name, username: username, password: password};
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post<any>(environment.apiEndpoint + '/register', data, {headers : headers})
      .map((response) => {

        return this.setCurrentUser(username, response);
      }).catch(AuthService.handleError);
  }

  private setCurrentUser(username: string, response) {
    const token = response && response.token;
    if (token) {
      this.token = token;
      localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
      return true;
    }
    return false;
  }

}
