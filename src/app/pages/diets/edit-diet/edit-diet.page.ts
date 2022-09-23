import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonDietFormComponent } from 'src/app/components/diets/forms/common-diet-form/common-diet-form.component';
import { GasolineDietFormComponent } from 'src/app/components/diets/forms/gasoline-diet-form/gasoline-diet-form.component';
import { CreateDietPhoto, DietType, PatchPayment, Payment, Reservation } from 'src/app/core/models';
import { AppRouter, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-diet',
  templateUrl: './edit-diet.page.html',
  styleUrls: ['./edit-diet.page.scss'],
})
export class EditDietPage implements OnInit {
  @ViewChild(CommonDietFormComponent) commonForm: CommonDietFormComponent;
  @ViewChild(GasolineDietFormComponent) gasolineForm: GasolineDietFormComponent;

  toolbarTitle = 'Dieta y gastos';
  form: FormGroup;
  payment: Payment;
  reservation: Reservation;

  // Photos
  photos: string[] = [];
  initPhotos: CreateDietPhoto[] = [];
  photosToRemove: CreateDietPhoto[] = [];

  constructor(
    private dietService: DietService,
    private snacker: SnackerService,
    private route: ActivatedRoute,
    private appRouter: AppRouter,
    private fb: FormBuilder
  ) {}

  get paymentType(): AbstractControl {
    return this.form.get('paymentType');
  }

  ngOnInit(): void {
    this.resolveData();
    this.form = this.initFormGroup();
  }

  async save() {
    const valid = this.isFormValid();
    if (!valid) {
      return;
    }

    const newPayment = this.getPaymentByType();
    this.dietService.patchPayment(this.payment.id, newPayment).subscribe({
      next: async (payment) => {
        // Añadir las fotos nuevas.
        this.photos.forEach((photo) => this.addDietPhotoToPayment(photo, payment.id));
        // Eliminar las fotos antiguas.
        this.photosToRemove.forEach((photo) => this.deletePhotoPermanently(photo));
        await this.snacker.showSuccessful('Pago actualizado');
        await this.appRouter.goToMyDiets(this.reservation.id);
      },
      error: () => {
        this.snacker.showFailed('Error al añadir el pago');
      },
    });
  }

  deletePhotoPermanently(photo: CreateDietPhoto) {
    this.dietService.deletePhoto(photo.id).subscribe({ next: () => {} });
  }

  addDietPhotoToPayment(photo: string, payment: string) {
    this.dietService.addPhotoToPayment({ payment, photo }).subscribe({ next: () => {} });
  }

  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    this.photos.push(image.dataUrl);
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  addToPhotosToRemove(index: number) {
    this.photosToRemove.push(this.initPhotos[index]);
    this.initPhotos.splice(index, 1);
  }

  private getPaymentByType() {
    switch (this.paymentType.value) {
      case DietType.Gasolina:
        return this.getGasolinePayment();
      default:
        return this.getCommonPayment();
    }
  }

  private getGasolinePayment() {
    const { liters, amount, description } = this.gasolineForm.form.value;
    const type = DietType.Gasolina;
    const payment: PatchPayment = { type, liters, amount, description };
    return payment;
  }

  private getCommonPayment() {
    const { amount, description } = this.commonForm.form.value;
    const type = this.paymentType.value;
    const payment: PatchPayment = { type, amount, description };
    return payment;
  }

  private initFormGroup(): FormGroup {
    return this.fb.group({
      dietType: [this.payment.type, [Validators.required]],
    });
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.payment = response.payment;
      this.reservation = response.reservation;
      this.initPhotos = this.payment.photos.map((photo) => this.serializePaymentPhoto(photo));
    });
  }

  private isFormValid() {
    if (!this.paymentType.value) {
      this.snacker.showFailed('Selecciona un tipo de pago');
      return false;
    }
    switch (this.paymentType.value) {
      case DietType.Gasolina:
        return this.isGasolineFormValid();
      default:
        return this.isCommonFormValid();
    }
  }

  private isGasolineFormValid() {
    if (this.gasolineForm.liters.hasError('required')) {
      this.snacker.showFailed('Rellena el campo litros');
      return false;
    }

    if (this.gasolineForm.liters.hasError('min')) {
      this.snacker.showFailed('El campo litros debe ser mayor que 0');
      return false;
    }

    if (this.gasolineForm.amount.hasError('required')) {
      this.snacker.showFailed('Rellena el campo importe');
      return false;
    }

    if (this.gasolineForm.amount.hasError('min')) {
      this.snacker.showFailed('El campo litros debe ser mayor que 0');
      return false;
    }
    return true;
  }

  private isCommonFormValid() {
    if (this.commonForm.amount.hasError('required')) {
      this.snacker.showFailed('Rellena el campo importe');
      return false;
    }
    if (this.commonForm.amount.hasError('min')) {
      this.snacker.showFailed('El campo litros debe ser mayor que 0');
      return false;
    }
    return true;
  }

  private serializePaymentPhoto(photo: CreateDietPhoto) {
    const photoRelativePath = photo.photo;
    const url = `${environment.fleetBaseUrl}${photoRelativePath}`;
    return { ...photo, url };
  }
}
