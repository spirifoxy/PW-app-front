import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Transaction} from '../_models/transaction';
import {ModalComponent} from '../modal/modal.component';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {HeaderComponent} from '../header/header.component';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  error: string;
  balance: number;

  transactionForm: FormGroup;
  filteredUsers: Observable<any[]>;

  users: User[] = [];
  transactions: Transaction[] = [];

  interval;

  displayedColumns = ['created_at', 'name', 'amount', 'cur_balance'];

  @ViewChild(ModalComponent) modalComponent: ModalComponent;
  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;
  @ViewChild(MatTableDataSource) dataSource: MatTableDataSource<Transaction>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {

    this.transactionForm = new FormGroup({
      userSelect: new FormControl(),
      amount: new FormControl('', [Validators.required])
    });

    this.updateUsersForSelector();
    this.updateTransactions();

    const user = JSON.parse(localStorage.getItem('currentUser')).user;
    this.balance = user.user_account.balance;

    this.interval = IntervalObservable.create(5000)
      .subscribe(() => {
        if (this.balance !== this.headerComponent.balance) {
          this.balance = this.headerComponent.balance;
          this.updateTransactions();
        }
      });
  }

  ngOnDestroy(): void {
    this.interval.unsubscribe();
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
      this.filteredUsers = this.transactionForm.controls['userSelect'].valueChanges
        .pipe(
          startWith(''),
          map(user => user ? this.filterUsers(user) : this.users.slice())
        );
    });
  }

  updateTransactions(): void {
    this.fetchUserTransactions().then(transactions => {
      this.transactions = transactions;
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
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

    const selectedUserId = this.transactionForm.controls['userSelect'].value.id;
    const amount = this.transactionForm.controls['amount'].value;

    if (!amount || amount < 0.1) {
      this.error = 'Zero or negative amount is not allowed';
      return;
    }

    if (!selectedUserId) {
      this.error = 'Choose user from the list';
      return;
    }

    this.userService.sendMoney(this.transactionForm.controls['userSelect'].value.id, amount)
      .subscribe(result => {

        this.modalComponent.hide();
        this.transactionForm.reset();

        // show new balance immediately
        // data will be verified with server 0..5 seconds later
        this.headerComponent.updateBalance(this.balance - amount);
        this.updateTransactions();

      }, sendError => this.error = sendError.message);
  }
}

