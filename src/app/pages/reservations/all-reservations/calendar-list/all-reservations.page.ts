import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
import { Reservation, vehicleTypeLabel } from 'src/app/core/models';
import { AppRouter, StorageService } from 'src/app/core/services';
import { alreadyStarted } from 'src/app/core/utils/dates/dates';

@Component({
  selector: 'app-all-reservations',
  templateUrl: './all-reservations.page.html',
  styleUrls: ['./all-reservations.page.scss'],
})
export class AllReservationsPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  toolbarTitle = 'Todas las reservas';
  segmentValue = 'reserve';

  userId: string;
  eventSource = [];
  viewTitle: string;
  selectedMonth: number;
  vehicleTypeLabel = vehicleTypeLabel;
  calendar = {
    currentDate: new Date(),
    noEventsLabel: 'No hay reservas aún',
  };

  selectedDate: Date;
  reservations: Reservation[] = [];
  reservationsListMode: Reservation[] = [];
  alreadyStarted = alreadyStarted;
  constructor(
    private storage: StorageService,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {}

  async ngOnInit() {
    this.resolveData();
    this.userId = (await this.storage.getUser()).id;
    this.loadReservations(this.reservations);
  }

  segmentChanged = (e) => (this.segmentValue = e.detail.value);

  loadReservations(reservations: Reservation[]): void {
    this.eventSource = reservations.map((reservation) => ({
      ...reservation,
      startTime: new Date(reservation.start),
      endTime: new Date(reservation.end),
    }));
    this.myCal.loadEvents();
    this.reservationsListMode = this.getListMode(this.reservations);
  }

  next(): void {
    this.myCal.slideNext();
  }

  back(): void {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title: string): void {
    console.log('onViewTitleChanged', title);
    this.viewTitle = title;
  }

  getFormattedHoursAndMinutes(date: Date): string {
    const str = date.toLocaleTimeString();
    return str.slice(0, -3);
  }

  isMine(reservation: any): boolean {
    console.log('Reservation Owner: ', reservation.owner.id);
    console.log('User: ', this.userId);
    return reservation.owner.id === this.userId;
  }

  differentDay(event): boolean {
    const start = event.startTime;
    const end = event.endTime;

    return start.getUTCDay() !== end.getUTCDay();
  }

  markDisabled = (date: Date) => {
    // Sometimes, yesterday is not marked as disabled. Zone times GTM+0100 & GTM+0200
    const current = new Date();
    current.setUTCDate(current.getUTCDate() - 1);
    return date < current;
  };

  goToAllReservationDetails(reservationId: string) {
    this.appRouter.goToAllReservationDetails(reservationId);
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservations = response.allReservations;
    });
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
