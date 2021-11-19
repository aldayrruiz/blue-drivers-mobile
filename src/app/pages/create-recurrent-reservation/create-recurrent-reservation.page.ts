import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonReorderGroup,
  ModalController,
} from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { finalize } from 'rxjs/operators';
import { CreateRecurrentReservation, Vehicle } from 'src/app/core/models';
import {
  CalModalService,
  LoadingService,
  MyDateService,
  ReservationService,
  SnackerService,
  WeekdayCheckbox,
  WeekdaysService,
} from 'src/app/core/services';
import { CalModalPage } from '../cal-modal/cal-modal.page';

@Component({
  selector: 'app-create-recurrent-reservation',
  templateUrl: './create-recurrent-reservation.page.html',
  styleUrls: ['./create-recurrent-reservation.page.scss'],
})
export class CreateRecurrentReservationPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  form: FormGroup;
  startRecurrent: Date;
  endRecurrent: Date;
  startTime: string;
  endTime: string;
  weekdays: WeekdayCheckbox[];
  vehicles: Vehicle[] = [];

  constructor(
    private reservationSrv: ReservationService,
    private calModalSrv: CalModalService,
    private weekdaySrv: WeekdaysService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private snacker: SnackerService,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    });
    this.initData();
    this.initFormBuilder();
    this.initStartAndEndDates();
    this.initWeekdaysCheckBoxes();
  }

  async openCalModal(type: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
    });
    if (type === 'start') {
      this.calModalSrv.setDate(this.startRecurrent);
    } else {
      this.calModalSrv.setDate(this.endRecurrent);
    }
    await modal.present();
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        const date = result.data.event.date;
        if (type === 'start') {
          this.startRecurrent = date;
        } else {
          this.endRecurrent = date;
        }
      }
    });
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.vehicles = ev.detail.complete(this.vehicles);
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  async createRecurrentReservation() {
    await this.loadingSrv.present();
    const data = this.getRecReservationData();
    this.reservationSrv
      .createRecurrent(data, false)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length === 0) {
            const message = 'Ninguna reserva creada. Comprueba los campos.';
            const toast = await this.snacker.createFailed(message);
            await toast.present();
          } else {
            const firstReservation = reservations[0];
            this.goToReservationDetails(firstReservation.id);
            const message = 'Reservas creadas con exito';
            const toast = await this.snacker.createSuccessful(message);
            await toast.present();
          }
        },
        async (error) => {
          const errorRes = error.error.errorReservations;
          const errorDates = errorRes.map((r) => new Date(r.start));
          if (error.status === 409) {
            const alert = await this.alertCtrl.create({
              message: this.getThereAreErrorReservationsMsg(errorDates),
              buttons: this.getThereAreErrorReservationsButtons(),
            });
            await alert.present();
          }
        }
      );
  }

  private async forceCreateRecurrentReservation() {
    await this.loadingSrv.present();
    const data = this.getRecReservationData();
    this.reservationSrv
      .createRecurrent(data, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          const message = 'Las reservas se han creado exitosamente';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
        },
        async (error) => {
          const status = error?.error?.status;
          const message = 'Error (status) desconocido. Intentalo mas tarde';
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }

  private goToReservationDetails(reservationId: string) {
    this.router.navigateByUrl(`members/my-reservations/${reservationId}`);
  }

  private initFormBuilder() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  private initStartAndEndDates() {
    // Set start date
    this.startRecurrent = new Date();
    const hms = this.dateSrv.getHmEach15m(new Date());
    this.startTime = hms.toISOString();
    // Set end date
    const hme = this.dateSrv.getHmEach15m(new Date());
    hme.setHours(hms.getHours() + 1);
    this.endTime = hme.toISOString();
    this.endRecurrent = new Date();
    this.endRecurrent.setHours(this.startRecurrent.getHours() + 1);
  }

  private initWeekdaysCheckBoxes() {
    this.weekdays = this.weekdaySrv.getCheckboxes();
  }

  private initData() {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
    });
  }

  private getRecReservationData(): CreateRecurrentReservation {
    const { title, description } = this.form.value;
    const weekdays = this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays);
    const startReservationTime = this.dateSrv
      .removeSeconds(new Date(this.startTime))
      .toJSON();
    const endReservationTime = this.dateSrv
      .removeSeconds(new Date(this.endTime))
      .toJSON();
    const startReservations = this.dateSrv
      .removeSeconds(new Date(this.startRecurrent))
      .toJSON();
    const endReservations = this.dateSrv
      .removeSeconds(new Date(this.endRecurrent))
      .toJSON();
    const vehicles = this.getVehiclesIds(this.vehicles);

    return {
      title,
      description,
      weekdays,
      startReservationTime,
      endReservationTime,
      startReservations,
      endReservations,
      vehicles,
    };
  }

  private getVehiclesIds(vehicles: Vehicle[]): string[] {
    return vehicles.map((vehicle) => vehicle.id);
  }

  private getThereAreErrorReservationsMsg(dates: Date[]) {
    let datesInAList = '';
    dates.forEach((date) => {
      datesInAList = datesInAList.concat(this.getElementHtml(date));
    });

    const message = `
      <p>Las siguientes reservas no pueden ser creadas porque no hay ningun vehículo disponible.</p>
      <ion-list>
        ${datesInAList}
      </ion-list>
    `;
    return message;
  }

  private getElementHtml(date: Date) {
    const elementTemplate = `
    <ion-item>
      <ion-label>${this.dateSrv.toDateString(date)}</ion-label>
    </ion-item>
    `;
    return elementTemplate;
  }

  private getThereAreErrorReservationsButtons() {
    return [
      {
        text: 'Forzar reserva',
        handler: async () => {
          this.forceCreateRecurrentReservation();
        },
      },
      {
        text: 'Cancelar',
      },
    ];
  }
}
