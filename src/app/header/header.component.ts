import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {UserService} from '../_services/user.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  title = 'Parrot Wings';
  user: string;
  balance: number;

  interval;

  constructor(private authService: AuthService,
              private userService: UserService,
  ) {}

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('currentUser')).user;
    if (user) {
      this.user = user.name;
      this.balance = user.user_account.balance;
    }

    this.interval = IntervalObservable.create(5000)
      .subscribe(() => {
        this.userService.get.currentBalance().subscribe(result => {

          console.log(result);

          if (result !== this.balance) {
            this.updateBalance(result);
          }

        }, error => console.log(error));
      });
  }

  ngOnDestroy(): void {
    this.interval.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  public updateBalance(newBalance: number): void {
    const user = JSON.parse(localStorage.getItem('currentUser')).user;

    this.balance = newBalance;
    user.user_account.balance = newBalance;
    this.authService.setCurrentUser(user);
  }
}
