import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
import { Reservation } from 'src/app/core/models/reservation.model';
import { GhostService, MyReservationsTabStorage } from 'src/app/core/services';
import { MyDateService } from 'src/app/core/services/my-date.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: 'my-reservations.page.html',
  styleUrls: ['my-reservations.page.scss'],
})
export class MyReservationsPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  selectedDate: Date;
  getTimeReserved = this.dateSrv.getTimeReserved;
  reservations: Reservation[] = [];
  segmentValue = 'calendar';

  userId: string;
  eventSource = [];
  viewTitle: string;
  selectedMonth: number;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    noEventsLabel: 'No tienes reservas',
  };

  constructor(
    private tabStorage: MyReservationsTabStorage,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private ghost: GhostService
  ) {}

  ngOnInit(): void {
    this.refreshComponentData();
  }

  onTimeSelected(event): void {
    const date = new Date(event.selectedTime);
    this.tabStorage.selectDate(date);
  }

  segmentChanged(event) {
    this.segmentValue = event.detail.value;
  }

  async goToReservation(id: string) {
    await this.ghost.goToReservationDetails(id);
  }

  next(): void {
    this.myCal.slideNext();
  }

  back(): void {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title: string): void {
    // Parse title
    this.viewTitle = title.replace('Week', 'Semana');
  }

  getFormattedHoursAndMinutes(date: Date): string {
    const str = date.toLocaleTimeString();
    return str.slice(0, -3);
  }

  differentDay(event): boolean {
    const start = event.startTime;
    const end = event.endTime;

    return start.getUTCDay() !== end.getUTCDay();
  }

  alreadyStarted(id: string) {
    const reservation = this.reservations.find((r) => r.id === id);
    const start = new Date(reservation.start);
    const now = new Date();
    return start <= now;
  }

  private refreshComponentData(): void {
    this.route.data.subscribe((response) => {
      this.reservations = response.myReservations;
      this.loadReservations();
    });
  }

  private loadReservations() {
    const events = [];

    // These reservations are all from requester.
    this.reservations.forEach((reservation) => {
      events.push({
        id: reservation.id,
        title: 'Reservado',
        startTime: new Date(reservation.start),
        endTime: new Date(reservation.end),
        vehicle: `${reservation.vehicle.brand} ${reservation.vehicle.model}`,
      });
    });

    this.eventSource = events;
  }
}
