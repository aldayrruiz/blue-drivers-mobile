import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
import { Reservation, Vehicle } from 'src/app/core/models';
import { MyReservationsTabStorage, VehicleIcon, VehicleIconProvider } from 'src/app/core/services';
import { alreadyStarted } from 'src/app/core/utils/dates/dates';

@Component({
  selector: 'app-my-reservations',
  templateUrl: 'my-reservations.page.html',
  styleUrls: ['my-reservations.page.scss'],
})
export class MyReservationsPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  // Variables
  toolbarTitle = 'Mis Reservas';
  segmentValue = 'calendar';
  viewTitle: string;
  eventSource = [];
  calendar = {
    currentDate: new Date(),
    noEventsLabel: 'No tienes reservas',
  };
  reservationsListMode: Reservation[] = [];

  // Functions
  reservationAlreadyStarted = alreadyStarted;
  private reservationsCalendarMode: Reservation[] = [];
  private icons: VehicleIcon[];

  constructor(
    private vehicleIconProvider: VehicleIconProvider,
    private tabStorage: MyReservationsTabStorage,
    private route: ActivatedRoute
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit(): void {
    this.refreshComponentData();
  }

  segmentChanged = (e) => (this.segmentValue = e.detail.value);

  onViewTitleChanged(title: string): void {
    this.viewTitle = title;
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }

  differentDay(event): boolean {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return start.getUTCDay() !== end.getUTCDay();
  }

  // Ionic2 Calendar

  next = () => this.myCal.slideNext();

  back = () => this.myCal.slidePrev();

  onTimeSelected(event): void {
    const date = new Date(event.selectedTime);
    this.tabStorage.selectDate(date);
  }

  private refreshComponentData(): void {
    this.route.data.subscribe((response) => {
      this.reservationsCalendarMode = response.myReservations;
      this.loadReservations();
    });
  }

  private loadReservations() {
    const events = [];

    // These reservations are all from requester.
    this.reservationsCalendarMode.forEach((reservation) => {
      events.push({
        ...reservation,
        startTime: new Date(reservation.start),
        endTime: new Date(reservation.end),
      });
    });

    this.eventSource = events;
    this.reservationsListMode = this.getListMode(this.reservationsCalendarMode);
  }

  private getListMode(reservations: Reservation[]) {
    const ordered = this.orderReservationsByStart(reservations);
    const result: Reservation[] = [];
    ordered.forEach((reservation) => {
      const isRecurrent = reservation.is_recurrent;
      if (!isRecurrent) {
        result.push(reservation);
      } else {
        // * Si es recurrente
        const index = this.isRecurrentIdInto(result, reservation);

        if (index >= 0) {
          const recurrent = result[index];
          const now = new Date();
          const reservationCompleted = new Date(recurrent.start) < now;
          if (reservationCompleted) {
            // Replace recurrent reservation with newer instance of that same recurrent
            result[index] = reservation;
          }
        } else {
          result.push(reservation);
        }
      }
    });
    return this.orderReservationsByStart(result).reverse();
  }

  private isRecurrentIdInto(reservations: Reservation[], recurrentReservation: Reservation) {
    const recurrentId = recurrentReservation.recurrent.id;
    const index = reservations.findIndex(
      (reservation) => reservation.recurrent?.id === recurrentId
    );
    return index;
  }

  private orderReservationsByStart(reservations: Reservation[]) {
    return reservations.sort((a, b) => (new Date(a.start) < new Date(b.start) ? -1 : 1));
  }
}
