import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage {
  version = environment.version;
  toolbarTitle = 'Tu cuenta';
  constructor(private loginService: LoginService, private router: Router) {}

  async logout() {
    await this.loginService.logout();
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
