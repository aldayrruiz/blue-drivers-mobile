import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { CreateIncident, Reservation } from 'src/app/core/models';
import {
  ErrorMessageService,
  IncidentService,
  LoadingService,
  MyReservationsTabStorage,
  SnackerService,
} from 'src/app/core/services';

@Component({
  selector: 'app-create-incident',
  templateUrl: './create-incident.page.html',
  styleUrls: ['./create-incident.page.scss', '../../../styles.css'],
})
export class CreateIncidentPage implements OnInit {
  form: FormGroup;
  reservation: Reservation;
  photoBase64: string;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private tabStorage: MyReservationsTabStorage,
    private loadingSrv: LoadingService,
    private errorMessage: ErrorMessageService,
    private snacker: SnackerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.getFormGroup();
    this.reservation = this.tabStorage.getCurrentReservation();
  }

  async createIncident(): Promise<void> {
    await this.loadingSrv.present();
    const newIncident = this.getIncident();
    this.incidentService
      .create(newIncident)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (incident) => {
          this.router.navigateByUrl(`members/my-incidents/${incident.id}`, {
            replaceUrl: true,
          });
          const message = 'Incidencia creado con exito';
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

  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    this.photoBase64 = image.dataUrl;
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  get incidentType(): AbstractControl {
    return this.form.get('incidentType');
  }

  private getFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      incidentType: ['OTHERS', [Validators.required]],
    });
  }

  private getIncident(): CreateIncident {
    const title = this.form.value.title;
    const description = this.form.value.description;
    const type = this.form.value.incidentType;
    const reservationId = this.reservation.id;

    const incident: CreateIncident = {
      title,
      description,
      type,
      reservation: reservationId,
    };

    if (this.photoBase64) {
      incident.photo = this.photoBase64;
    }

    return incident;
  }
}
