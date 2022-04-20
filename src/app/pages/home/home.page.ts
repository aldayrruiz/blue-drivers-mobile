import { Component, OnInit } from '@angular/core';
import { ROUTE } from 'src/app/core/utils/routing/menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  buttons = [
    { title: 'Reserva por vehículo', icon: 'car-sport-outline', url: ROUTE.VEHICLES },
    { title: 'Reserva por fecha', icon: 'calendar-number-outline', url: ROUTE.RESERVE_BY_DATE },
    { title: 'Mis reservas', icon: 'document-text-outline', url: ROUTE.MY_RESERVATIONS },
    { title: 'Mis conflictos', icon: 'hammer-outline', url: ROUTE.MY_TICKETS },
    { title: 'Mis incidencias', icon: 'warning-outline', url: ROUTE.MY_INCIDENTS },
    { title: 'Mapa', icon: 'map-outline', url: ROUTE.MAP },
  ];

  toolbarTitle = 'Home';

  ngOnInit() {}
}
