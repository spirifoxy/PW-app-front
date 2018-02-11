import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  amount: number;
  error: string;

  userSelectCtrl: FormControl;
  filteredUsers: Observable<any[]>;

  users: User[] = [];

  constructor(private userService: UserService) {

    this.userSelectCtrl = new FormControl();
  }

  ngOnInit(): void {

    this.fetchUsersForSelector().then(users => {
      this.users = users;
      this.filteredUsers = this.userSelectCtrl.valueChanges
          .pipe(
            startWith(''),
            map(user => user ? this.filterUsers(user) : this.users.slice())
          );
    });
  }

  filterUsers(selectedUser: User) {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(selectedUser.name.toLowerCase()) === 0);
  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }


  fetchUsersForSelector(): Promise<User[]> {
    return this.userService.get.usersForSelector();
  }

  createTransaction(e) {

    e.preventDefault();

    if (!this.amount || ! this.userSelectCtrl.value.id) {
      return;
    }

    this.userService.sendMoney(this.userSelectCtrl.value.id, this.amount)
      .subscribe(result => {

        console.log(result);

      }, sendError => this.error = sendError.message);
  }
}

