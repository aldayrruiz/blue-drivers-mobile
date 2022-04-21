import { ROUTE } from 'src/app/core/utils/routing/menu';

export const homeButtons = [
  { title: 'Reserva por vehículo', icon: 'car-sport-outline', url: ROUTE.VEHICLES },
  { title: 'Reserva por fecha', icon: 'calendar-number-outline', url: ROUTE.RESERVE_BY_DATE },
  { title: 'Mis reservas', icon: 'document-text-outline', url: ROUTE.MY_RESERVATIONS },
  { title: 'Mis conflictos', icon: 'hammer-outline', url: ROUTE.MY_TICKETS },
  { title: 'Mis incidencias', icon: 'warning-outline', url: ROUTE.MY_INCIDENTS },
  { title: 'Mapa', icon: 'location-outline', url: ROUTE.MAP },
];
