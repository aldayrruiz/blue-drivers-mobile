import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Reservation, Vehicle } from 'src/app/core/models';
import {
  ErrorMessageService,
  LoadingService,
  MyDateService,
  MyReservationsTabStorage,
  ReservationService,
  SnackerService,
} from 'src/app/core/services';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.page.html',
  styleUrls: ['./reservation-details.page.scss'],
})
export class ReservationDetailsPage implements OnInit {
  getTimeReserved = this.dateSrv.getTimeReserved;
  reservation: Reservation;
  vehicle: Vehicle;

  constructor(
    private tabStorage: MyReservationsTabStorage,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router,
    private snacker: SnackerService,
    private alertCtrl: AlertController,
    private loadingSrv: LoadingService,
    private errorMessage: ErrorMessageService,
    private dateSrv: MyDateService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      console.log('Reservation details response received!');
      this.reservation = response.reservation;
      this.vehicle = this.reservation.vehicle;
      this.storeReservationInTab();
    });
  }

  alreadyStarted(reservation: Reservation): boolean {
    const start = new Date(reservation.start);
    const now = new Date();

    return start <= now;
  }

  async showCancelReservationAlert(): Promise<void> {
    const alerElement = await this.alertCtrl.create({
      message: '¿Esta seguro que quiere cancelar esta reserva?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: async () => await this.cancelReservation(),
        },
      ],
    });

    await alerElement.present(); // Mostrar al usuario
  }

  private storeReservationInTab() {
    this.tabStorage.setCurrentReservation(this.reservation);
  }

  private async cancelReservation(): Promise<void> {
    await this.loadingSrv.present();

    this.reservationService
      .delete(this.reservation.id)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          const message = 'Reserva cancelada con exito';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }
}
