import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'Parrot Wings';

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
