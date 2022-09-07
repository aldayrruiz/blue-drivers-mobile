import { Component, OnInit } from '@angular/core';
import { AppRouter, LoginService, StorageService } from 'src/app/core/services';
import { ROUTE } from 'src/app/core/utils/routing/menu';
import { environment } from 'src/environments/environment';
import { homeButtons } from '../home/home-buttons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  fullname: string;
  version = environment.version;
  email: string;

  pages = [
    { title: 'Home', url: ROUTE.HOME, icon: 'home-outline' },
    ...homeButtons,
    { title: 'Mi cuenta', url: ROUTE.ACCOUNT, icon: 'person-outline' },
  ];

  constructor(
    private loginService: LoginService,
    private storage: StorageService,
    private ghost: AppRouter
  ) {}

  async ngOnInit() {
    const user = await this.storage.getUser();
    this.email = user.email;
    this.fullname = user.fullname;
  }

  async logOut() {
    await this.loginService.logout();
    await this.ghost.goToLogin();
  }
}
