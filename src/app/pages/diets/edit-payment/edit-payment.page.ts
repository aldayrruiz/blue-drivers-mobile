import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonPaymentFormComponent } from 'src/app/components/diets/forms/common-payment-form/common-payment-form.component';
import { GasolinePaymentFormComponent } from 'src/app/components/diets/forms/gasoline-payment-form/gasoline-payment-form.component';
import {
  CreateDietPhoto,
  PatchPayment,
  Payment,
  PaymentType,
  Reservation,
} from 'src/app/core/models';
import { AppRouter, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.page.html',
  styleUrls: ['./edit-payment.page.scss'],
})
export class EditPaymentPage implements OnInit {
  @ViewChild(CommonPaymentFormComponent) commonForm: CommonPaymentFormComponent;
  @ViewChild(GasolinePaymentFormComponent) gasolineForm: GasolinePaymentFormComponent;

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

  get demand(): AbstractControl {
    return this.form.get('demand');
  }

  ngOnInit(): void {
    this.resolveData();
    this.form = this.initFormGroup();
  }

  save() {
    const valid = this.isFormValid();
    if (!valid) {
      return;
    }

    const newPayment = this.getPaymentByType();
    this.dietService.patchPayment(this.payment.id, newPayment).subscribe({
      next: (payment) => {
        // Añadir las fotos nuevas.
        this.photos.forEach((photo) => this.addDietPhotoToPayment(photo, payment.id));
        // Eliminar las fotos antiguas.
        this.photosToRemove.forEach((photo) => this.deletePhotoPermanently(photo));
        this.snacker.showSuccessful('Pago actualizado');
        this.appRouter.goToMyDiets(this.reservation.id);
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
      case PaymentType.Gasolina:
        return this.getGasolinePayment();
      default:
        return this.getCommonPayment();
    }
  }

  private getGasolinePayment() {
    const { liters, amount, description } = this.gasolineForm.form.value;
    const type = PaymentType.Gasolina;
    const demand = this.demand.value;
    const payment: PatchPayment = { type, liters, amount, description, demand };
    return payment;
  }

  private getCommonPayment() {
    const { amount, description } = this.commonForm.form.value;
    const type = this.paymentType.value;
    const demand = this.demand.value;
    const payment: PatchPayment = { type, amount, description, demand };
    return payment;
  }

  private initFormGroup(): FormGroup {
    return this.fb.group({
      paymentType: [this.payment.type, [Validators.required]],
      demand: [this.payment.demand, [Validators.required]],
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
      case PaymentType.Gasolina:
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
