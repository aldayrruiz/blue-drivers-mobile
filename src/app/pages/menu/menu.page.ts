import { Component, OnInit } from '@angular/core';
import { Key, StorageService } from 'src/app/core/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  fullname: string;
  email: string;

  pages = [
    { title: 'Vehiculos', url: '/members/vehicles', icon: 'car' },
    {
      title: 'Mis Reservas',
      url: '/members/my-reservations',
      icon: 'calendar',
    },
    { title: 'Mis Tickets', url: '/members/my-tickets', icon: 'ticket' },
    { title: 'Mis Incidencias', url: '/members/my-incidents', icon: 'warning' },
    { title: 'Cuenta', url: '/members/account', icon: 'person' },
  ];

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    const user = await this.storage.getParsed(Key.user);
    this.email = user.email;
    this.fullname = user.fullname;
  }
}
