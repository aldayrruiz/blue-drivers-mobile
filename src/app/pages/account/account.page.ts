import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage {
  constructor(private loginService: LoginService, private router: Router) {}

  async logout() {
    await this.loginService.logout();
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
