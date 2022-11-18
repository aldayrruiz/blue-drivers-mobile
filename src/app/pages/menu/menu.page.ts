import { Component, OnInit } from '@angular/core';
import { AppRouter, LoginService, StorageService } from 'src/app/core/services';
import { ROUTE } from 'src/app/core/utils/routing/menu';
import { environment } from 'src/environments/environment';
import { homeButtons } from '../home/home-buttons';

interface HomeButton {
  title: string;
  url: string;
  icon: string;
  admin?: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  version = environment.version;
  user: any;

  pages: HomeButton[] = [
    { title: 'Home', url: ROUTE.HOME, icon: 'home-outline' },
    ...homeButtons,
    { title: 'Mi cuenta', url: ROUTE.ACCOUNT, icon: 'person-outline' },
  ];

  constructor(
    private loginService: LoginService,
    private storage: StorageService,
    private appRouter: AppRouter
  ) {}

  async ngOnInit() {
    const user = await this.storage.getUser();
    this.user = user;
  }

  async logOut() {
    await this.loginService.logout();
    await this.appRouter.goToLogin();
  }
}
