import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Diet, Payment, Reservation } from 'src/app/core/models';
import { AppRouter, AssetsService, LoadingService, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-diets',
  templateUrl: './my-diets.page.html',
  styleUrls: ['./my-diets.page.scss'],
})
export class MyDietsPage implements OnInit {
  toolbarTitle = 'Dieta y gastos';
  reservation: Reservation;
  diet: Diet;
  payments: Payment[] = [];
  completed = false;
  numberOfDiets: number;
  numberOfDietsImg: string;

  constructor(
    private assetsService: AssetsService,
    private loadingSrv: LoadingService,
    private alertCtrl: AlertController,
    private dietService: DietService,
    private snacker: SnackerService,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {
    this.numberOfDietsImg = this.assetsService.getUrl('icon/diets/number-of-diets.jpeg');
  }

  ngOnInit() {
    this.resolveData();
  }

  goToAddDiet() {
    this.appRouter.goToAddDiet(this.reservation.id);
  }

  goToAddPayment() {
    this.appRouter.goToAddPayment(this.reservation.id);
  }

  goToReservation(reservationId: string) {
    this.appRouter.goToMyReservationDetails(reservationId);
  }

  goToEditPayment(id: string) {
    this.appRouter.goToEditPayment(this.reservation.id, id);
  }

  differentDay(event): boolean {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return start.getUTCDay() !== end.getUTCDay();
  }

  async showDeletePaymentAlert(event: any, paymentId: string) {
    event.stopPropagation();
    const buttons = this.getDeleteAlertButtons(paymentId);
    const alertElement = await this.alertCtrl.create({ message: '¿Esta seguro?', buttons });
    await alertElement.present(); // Mostrar al usuario
  }

  async showCompleteDietAlert() {
    const buttons = this.getCompleteDietAlertButtons();
    const message = 'Tras cerrar la dieta y los gastos, no se podrán modificar. ¿Esta seguro?';
    const alertElement = await this.alertCtrl.create({ message, buttons });
    await alertElement.present(); // Mostrar al usuario
  }

  setNumberOfDietsToZero(event: any) {
    event.stopPropagation();
    const number_of_diets = 0;
    this.dietService.patchDiet(this.diet.id, { number_of_diets }).subscribe({
      next: () => {
        this.numberOfDiets = 0;
        this.snacker.showSuccessful('Se ha eliminado la dieta correctamente');
      },
      error: () => this.snacker.showFailed('Error al eliminar la dieta'),
    });
  }

  private markDietAsCompleted() {
    this.dietService.patchDiet(this.diet.id, { completed: true }).subscribe({
      next: async () => {
        this.completed = true;
        this.snacker.showSuccessful('Dieta completada correctamente');
      },
      error: async () => this.snacker.showFailed('Error al completar dieta'),
    });
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservation = response.reservation;
      this.diet = response.diet;
      this.completed = this.diet.completed;
      this.payments = this.diet.payments;
      this.serializePayments();
      this.numberOfDiets = Number(this.diet.number_of_diets);
    });
  }

  /**
   * Add a "photo" field. So it can be called in html like <img [src]="payment.photo" />
   */
  private serializePayments() {
    this.payments = this.payments.map((payment) => this.serializePayment(payment));
  }

  private serializePayment(payment: Payment) {
    const photoRelativePath = payment.photos[0]?.photo;
    if (!photoRelativePath) {
      return payment;
    }
    const photoUrl = `${environment.fleetBaseUrl}${photoRelativePath}`;
    return { ...payment, photo: photoUrl };
  }

  // Delete payment alert buttons
  private getDeleteAlertButtons(paymentId: string) {
    return [
      { text: 'No', role: 'cancel' },
      { text: 'Si', handler: async () => await this.deletePayment(paymentId) },
    ];
  }

  // Complete diet alert buttons
  private getCompleteDietAlertButtons() {
    return [
      { text: 'No', role: 'cancel' },
      { text: 'Si', handler: () => this.markDietAsCompleted() },
    ];
  }

  private async deletePayment(id: string) {
    await this.loadingSrv.present();
    this.dietService
      .deletePayment(id)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe({
        next: () => {
          this.snacker.showSuccessful('Pago eliminado correctamente');
          this.payments = this.payments.filter((payment) => payment.id !== id);
        },
        error: () => this.snacker.showFailed('Error al eliminar pago'),
      });
  }
}
