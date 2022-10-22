import { ROUTE } from 'src/app/core/utils/routing/menu';

export const homeButtons = [
  { title: 'Reserva por vehículo', icon: 'car-sport-outline', url: ROUTE.VEHICLES },
  { title: 'Reserva por fecha', icon: 'calendar-number-outline', url: ROUTE.RESERVE_BY_DATE },
  { title: 'Mis reservas', icon: 'document-text-outline', url: ROUTE.MY_RESERVATIONS },
  {
    title: 'Todas las reservas',
    icon: 'document-text-outline',
    url: ROUTE.ALL_RESERVATIONS,
    admin: true,
  },
  { title: 'Mis conflictos', icon: '/assets/icon/home/gavel.svg', url: ROUTE.MY_TICKETS },
  { title: 'Mis incidencias', icon: 'warning-outline', url: ROUTE.MY_INCIDENTS },
  { title: 'Mapa', icon: '/assets/icon/home/map.svg', url: ROUTE.MAP },
];
