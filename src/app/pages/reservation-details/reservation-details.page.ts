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
    private reservationService: ReservationService,
    private tabStorage: MyReservationsTabStorage,
    private errorMessage: ErrorMessageService,
    private alertCtrl: AlertController,
    private loadingSrv: LoadingService,
    private snacker: SnackerService,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
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
    const buttons = this.getAlertButtons();
    const alertElement = await this.alertCtrl.create({
      message: '¿Esta seguro?',
      buttons,
    });

    await alertElement.present(); // Mostrar al usuario
  }

  private storeReservationInTab() {
    this.tabStorage.setCurrentReservation(this.reservation);
  }

  private async cancelReservation(subsequentReservations: boolean) {
    await this.loadingSrv.present();

    this.reservationService
      .delete(this.reservation.id, subsequentReservations)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          const message = 'Operación realizada con exito';
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

  private getAlertButtons() {
    const buttons = [
      {
        text: 'No',
        role: 'cancel',
      },
      {
        text: 'Si',
        handler: async () => await this.cancelReservation(false),
      },
    ];

    const cancelRecurrentButton = {
      text: 'Si y posteriores',
      handler: async () => await this.cancelReservation(true),
    };

    if (this.reservation.is_recurrent) {
      buttons.push(cancelRecurrentButton);
    }

    return buttons;
  }
}
