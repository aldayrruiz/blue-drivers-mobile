import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage {
  toolbarTitle = 'Tu cuenta';
  constructor(private loginService: LoginService, private router: Router) {}

  async logout() {
    await this.loginService.logout();
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
