import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { CreateIncident, IncidentType, Reservation } from 'src/app/core/models';
import {
  ErrorMessageService,
  Ghost,
  IncidentService,
  LoadingService,
  MyReservationsTabStorage,
  SnackerService,
} from 'src/app/core/services';
import { incidentTypeValidators } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-create-incident',
  templateUrl: './create-incident.page.html',
  styleUrls: ['./create-incident.page.scss', '../../../styles.css'],
})
export class CreateIncidentPage implements OnInit {
  toolbarTitle = 'Crear incidencia';
  form: FormGroup;
  reservation: Reservation;
  photoBase64: string;

  constructor(
    private readonly tabStorage: MyReservationsTabStorage,
    private readonly errorMessage: ErrorMessageService,
    private readonly incidentService: IncidentService,
    private readonly loadingSrv: LoadingService,
    private readonly snacker: SnackerService,
    private readonly fb: FormBuilder,
    private readonly ghost: Ghost
  ) {}

  get description(): AbstractControl {
    return this.form.get('description');
  }

  get incidentType(): AbstractControl {
    return this.form.get('incidentType');
  }

  ngOnInit(): void {
    this.form = this.initFormGroup();
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
          await this.ghost.goToIncidentDetails(incident.id);
          const msg = 'Incidencia creado con éxito';
          await this.snacker.showSuccessful(msg);
        },
        // error is the message from the server - executes if response was not ok
        async (error) => {
          const msg = this.errorMessage.get(error);
          await this.snacker.showFailed(msg);
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

  private initFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.maxLength(50)]],
      incidentType: [IncidentType.OTHERS, incidentTypeValidators],
    });
  }

  private getIncident() {
    const incident: CreateIncident = {
      description: this.form.value.description,
      type: this.form.value.incidentType,
      reservation: this.reservation.id,
    };

    return this.setPhoto(incident);
  }

  private setPhoto(incident: CreateIncident) {
    if (this.photoBase64) {
      incident.photo = this.photoBase64 ||= undefined;
    }
    return incident;
  }
}
