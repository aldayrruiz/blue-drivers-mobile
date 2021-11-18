import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { finalize } from 'rxjs/operators';
import { Vehicle } from 'src/app/core/models';
import { CreateReservationByDate } from 'src/app/core/models/create/create-reservation-by-date.model';
import {
  CalModalService,
  ErrorMessageService,
  LoadingService,
  MyDateService,
  ReservationService,
  SnackerService,
} from 'src/app/core/services';
import { DESC_LEN, TITLE_LEN } from 'src/app/shared/utils/fields-config';
import { CalModalPage } from '../cal-modal/cal-modal.page';

@Component({
  selector: 'app-create-reservation-by-date',
  templateUrl: './create-reservation-by-date.page.html',
  styleUrls: ['./create-reservation-by-date.page.scss'],
})
export class CreateReservationByDatePage implements OnInit {
  form: FormGroup;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  vehicles: Vehicle[] = [];

  constructor(
    private reservationSrv: ReservationService,
    private errorMessage: ErrorMessageService,
    private calModalService: CalModalService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private snacker: SnackerService,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initData();
    this.initFormGroup();
    this.initDates();
  }

  async create() {
    await this.loadingSrv.present();
    const data = this.getData();
    const start = new Date(data.start);
    const end = new Date(data.end);
    if (end <= start) {
      const message = 'La fecha de comienzo debe ser anterior a la final';
      const toast = await this.snacker.createFailed(message);
      await toast.present();
      return;
    }
    this.reservationSrv
      .createByDate(data)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        // newReservation is the response from server - executes if response was ok
        async (reservation) => {
          this.router.navigate(['..', reservation.id], {
            relativeTo: this.route,
          });
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

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  async openCalModal(type: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
    });

    if (type === 'start') {
      this.calModalService.setDate(this.startDate);
    } else {
      this.calModalService.setDate(this.endDate);
    }

    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        const date = result.data.event.date;

        if (type === 'start') {
          this.startDate = date;
        } else {
          this.endDate = date;
        }
      }
    });
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.vehicles = ev.detail.complete(this.vehicles);
  }

  private getData() {
    const hmStart = new Date(this.startTime);
    const hmEnd = new Date(this.endTime);
    this.startDate.setHours(hmStart.getHours());
    this.startDate.setMinutes(hmStart.getMinutes());
    this.endDate.setHours(hmEnd.getHours());
    this.endDate.setMinutes(hmEnd.getMinutes());

    const start = this.dateSrv.removeSeconds(this.startDate);
    const end = this.dateSrv.removeSeconds(this.endDate);

    const title = this.form.value.title;
    const description = this.form.value.description;

    const vehicles = this.vehicles.map((vehicle) => vehicle.id);

    const newReservation: CreateReservationByDate = {
      title,
      start: start.toJSON(),
      end: end.toJSON(),
      description,
      vehicles
    };

    return newReservation;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(TITLE_LEN)]],
      description: ['', [Validators.required, Validators.maxLength(DESC_LEN)]],
    });
  }

  private initDates() {
    const now = new Date();
    this.startDate = new Date(now);
    const hms = this.dateSrv.getHmEach15m(now);
    this.startTime = hms.toISOString();

    // Set end date
    const hme = this.dateSrv.getHmEach15m(now);
    hme.setHours(hms.getHours() + 1);
    this.endTime = hme.toISOString();
    this.endDate = new Date(this.startTime);
    this.endDate.setHours(this.startDate.getHours() + 1);
  }

  private initData() {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
    });
  }
}
