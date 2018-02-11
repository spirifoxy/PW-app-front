import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../_models/user';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class UserService {

  headers: HttpHeaders;

  constructor(
              private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }


  get = {
    usersForSelector: (): Promise<User[]> => {
      return this.http.get<User[]>(environment.apiEndpoint + '/users/select').map(response => {
        console.log(response);
        return response;
      }).toPromise();
    }
  };


  sendMoney(userId: number, amount: number): Observable<boolean> {

    const data = {userId: userId, amount: amount};

    return this.http.post(environment.apiEndpoint + '/user/sendMoney', data, {headers : this.headers})
      .map((response) => {
        console.log(response);
        return response;
      }).catch(AuthService.handleError);
  }

  getAll() {
    return this.http.get<User[]>('/api/users/all');
  }

}
