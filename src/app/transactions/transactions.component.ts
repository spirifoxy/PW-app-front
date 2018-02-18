import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Transaction} from '../_models/transaction';
import {ModalComponent} from '../modal/modal.component';


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
  transactions: Transaction[] = [];

  displayedColumns = ['created_at', 'name', 'amount', 'cur_balance'];

  @ViewChild(ModalComponent) modalComponent: ModalComponent;
  @ViewChild(MatTableDataSource) dataSource: MatTableDataSource<Transaction>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) {

    this.userSelectCtrl = new FormControl();
  }

  ngOnInit(): void {

    this.updateUsersForSelector();

    this.fetchUserTransactions().then(transactions => {
      this.transactions = transactions;
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
    });
  }

  filterUsers(selectedUser: any) {
    selectedUser = selectedUser.name ? selectedUser.name : selectedUser;
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(selectedUser.toLowerCase()) === 0);
  }

  filterTransactions(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  updateUsersForSelector(): void {
    this.fetchUsersForSelector().then(users => {
      this.users = users;
      this.filteredUsers = this.userSelectCtrl.valueChanges
        .pipe(
          startWith(''),
          map(user => user ? this.filterUsers(user) : this.users.slice())
        );
    });
  }

  fetchUsersForSelector(): Promise<User[]> {
    return this.userService.get.usersForSelector();
  }

  fetchUserTransactions(): Promise<Transaction[]> {
    return this.userService.get.userTransactions();
  }

  createTransaction(e) {

    e.preventDefault();

    if (!this.amount) {
      return;
    }

    if (!this.userSelectCtrl.value.id) {
      this.error = 'Choose user from the list';
      return;
    }

    this.userService.sendMoney(this.userSelectCtrl.value.id, this.amount)
      .subscribe(result => {

        this.modalComponent.hide();

      }, sendError => this.error = sendError.message);
  }
}

