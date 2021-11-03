import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { CreateReservation, VehicleDetails } from 'src/app/core/models';
import {
  CalModalService,
  ErrorMessageService,
  LoadingService,
  MyDateService,
  ReservationService,
  SnackerService,
  VehiclesTabStorage,
} from 'src/app/core/services';
import { CalModalPage } from '../cal-modal/cal-modal.page';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss', '../../../styles.css'],
})
export class CreateReservationPage implements OnInit {
  form: FormGroup;
  vehicle: VehicleDetails;
  dayMonthYearStart: Date;
  dayMonthYearEnd: Date;
  hourMinutesStart: string;
  hourMinutesEnd: string;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private tabStorage: VehiclesTabStorage,
    private modalCtrl: ModalController,
    private calModalService: CalModalService,
    private snacker: SnackerService,
    private router: Router,
    private loadingSrv: LoadingService,
    private errorMessage: ErrorMessageService,
    private dateSrv: MyDateService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    });

    // Set start date
    this.dayMonthYearStart = new Date(this.tabStorage.getSelectedDate());
    const hms = this.dateSrv.getHmEach15m(new Date());
    this.hourMinutesStart = hms.toISOString();

    // Set end date
    const hme = this.dateSrv.getHmEach15m(new Date());
    hme.setHours(hms.getHours() + 1);
    this.hourMinutesEnd = hme.toISOString();
    this.dayMonthYearEnd = new Date(this.tabStorage.getSelectedDate());
    this.dayMonthYearEnd.setHours(this.dayMonthYearStart.getHours() + 1);

    // Set vehicle
    this.vehicle = this.tabStorage.getCurrentVehicle();
  }

  async createReservation(): Promise<void> {
    await this.loadingSrv.present();
    const newReservation = this.getReservation();
    const start = new Date(newReservation.start);
    const end = new Date(newReservation.end);
    if (end <= start) {
      const message = 'La fecha de comienzo debe ser anterior a la final';
      const toast = await this.snacker.createFailed(message);
      await toast.present();
      return;
    }
    this.reservationService
      .create(newReservation)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        // newReservation is the response from server - executes if response was ok
        async (reservation) => {
          this.router.navigateByUrl(
            `members/my-reservations/${reservation.id}`,
            {
              replaceUrl: true,
            }
          );
          const message = 'Reserva creada con exito';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
        },
        // error is the message from the server - executes if response was not ok
        async (error) => {
          const message = this.errorMessage.get(error);
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }

  async openCalModal(type: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
    });

    if (type === 'start') {
      console.log(this.dayMonthYearStart);
      this.calModalService.setDate(this.dayMonthYearStart);
    } else {
      console.log(this.dayMonthYearEnd);
      this.calModalService.setDate(this.dayMonthYearEnd);
    }

    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        console.log(result.data.event);
        const date = result.data.event.date;

        if (type === 'start') {
          this.dayMonthYearStart = date;
        } else {
          this.dayMonthYearEnd = date;
        }
      }
    });
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  private getReservation(): CreateReservation {
    const hmStart = new Date(this.hourMinutesStart);
    const hmEnd = new Date(this.hourMinutesEnd);
    this.dayMonthYearStart.setHours(hmStart.getHours());
    this.dayMonthYearStart.setMinutes(hmStart.getMinutes());
    this.dayMonthYearEnd.setHours(hmEnd.getHours());
    this.dayMonthYearEnd.setMinutes(hmEnd.getMinutes());

    const title = this.form.value.title;
    const description = this.form.value.description;

    const newReservation: CreateReservation = {
      title,
      start: this.dayMonthYearStart.toJSON(),
      end: this.dayMonthYearEnd.toJSON(),
      description,
      vehicle: this.vehicle.id,
    };

    return newReservation;
  }
}
