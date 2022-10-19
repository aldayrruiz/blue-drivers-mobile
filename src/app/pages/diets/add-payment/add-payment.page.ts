import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonPaymentFormComponent } from 'src/app/components/diets/forms/common-payment-form/common-payment-form.component';
import { GasolinePaymentFormComponent } from 'src/app/components/diets/forms/gasoline-payment-form/gasoline-payment-form.component';
import { CreatePayment, PaymentType, Reservation } from 'src/app/core/models';
import { AppRouter, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.page.html',
  styleUrls: ['./add-payment.page.scss'],
})
export class AddPaymentPage implements OnInit {
  @ViewChild(CommonPaymentFormComponent) commonForm: CommonPaymentFormComponent;
  @ViewChild(GasolinePaymentFormComponent) gasolineForm: GasolinePaymentFormComponent;

  toolbarTitle = 'Dieta y gastos';
  form: FormGroup;
  reservation: Reservation;
  isThereAPhoto = false;
  photo: string;
  dietId: string;

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
    this.form = this.initFormGroup();
    this.resolveData();
  }

  save() {
    const valid = this.isFormValid();
    if (!valid) {
      return;
    }

    const newPayment = this.getPaymentByType();
    this.dietService.createPayment(newPayment).subscribe({
      next: (payment) => {
        this.addPhotoToPayment(this.photo, payment.id);
        this.snacker.showSuccessful('La dieta ha sido añadida');
        this.appRouter.goToMyDiets(this.reservation.id);
      },
      error: () => {
        this.snacker.showFailed('Error al añadir la dieta');
      },
    });
  }

  addPhotoToPayment(photo: string, payment: string) {
    if (!this.isThereAPhoto) {
      return;
    }
    this.dietService.addPhotoToPayment({ payment, photo }).subscribe({ next: () => {} });
  }

  async addPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      this.photo = image.dataUrl;
      this.isThereAPhoto = true;
    } catch (error) {
      console.log('User did not take a photo');
    }
  }

  removePhoto() {
    this.photo = '';
    this.isThereAPhoto = false;
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
    const diet = this.dietId;
    const demand = this.demand.value;
    const payment: CreatePayment = { diet, type, liters, amount, description, demand };
    return payment;
  }

  private getCommonPayment() {
    const { amount, description } = this.commonForm.form.value;
    const type = this.paymentType.value;
    const diet = this.dietId;
    const demand = this.demand.value;
    const payment: CreatePayment = { diet, type, amount, description, demand };
    return payment;
  }

  private initFormGroup(): FormGroup {
    return this.fb.group({
      paymentType: [PaymentType.Otros, [Validators.required]],
      demand: [false, [Validators.required]],
    });
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservation = response.reservation;
      this.dietId = this.reservation.diet.id;
    });
  }

  private isFormValid() {
    if (!this.paymentType.value) {
      this.snacker.showFailed('Selecciona un tipo de dieta');
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
}
