import { Component, OnInit } from '@angular/core';
import { FastStorageService } from 'src/app/core/services/fast-storage.service';

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

  constructor(private fastStorage: FastStorageService) {}

  ngOnInit() {
    const userData = this.fastStorage.getUser();
    this.email = userData.email;
    this.fullname = userData.fullname;
  }
}
