import { Component, OnInit } from '@angular/core';
import { ROUTE } from 'src/app/core/utils/routing/menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  buttons = [
    { title: 'Vehículos', url: ROUTE.VEHICLES },
    { title: 'Mis Reservas', url: ROUTE.MY_RESERVATIONS },
    { title: 'Mis Tickets', url: ROUTE.MY_TICKETS },
    { title: 'Mis Incidencias', url: ROUTE.MY_INCIDENTS },
    { title: 'Cuenta', url: ROUTE.ACCOUNT },
  ];

  toolbarTitle = 'Home';

  ngOnInit() {}
}
