import { Component, OnInit } from '@angular/core';
import { Ghost, Key, LoginService, StorageService } from 'src/app/core/services';
import { ROUTE } from 'src/app/core/utils/routing/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  fullname: string;
  email: string;

  pages = [
    { title: 'Home', url: ROUTE.HOME, icon: 'home' },
    { title: 'Vehículos', url: ROUTE.VEHICLES, icon: 'car' },
    { title: 'Mis Reservas', url: ROUTE.MY_RESERVATIONS, icon: 'calendar' },
    { title: 'Mis Tickets', url: ROUTE.MY_TICKETS, icon: 'ticket' },
    { title: 'Mis Incidencias', url: ROUTE.MY_INCIDENTS, icon: 'warning' },
    { title: 'GNSS', url: ROUTE.GNSS, icon: 'location' },
    { title: 'Cuenta', url: ROUTE.ACCOUNT, icon: 'person' },
  ];

  constructor(
    private loginService: LoginService,
    private storage: StorageService,
    private ghost: Ghost
  ) {}

  async ngOnInit() {
    const user = await this.storage.getParsed(Key.user);
    this.email = user.email;
    this.fullname = user.fullname;
  }

  async logOut() {
    await this.loginService.logout();
    await this.ghost.goToLogin();
  }
}
