import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonDietFormComponent } from 'src/app/components/diets/forms/common-diet-form/common-diet-form.component';
import { GasolineDietFormComponent } from 'src/app/components/diets/forms/gasoline-diet-form/gasoline-diet-form.component';
import { CreatePayment, DietType, Reservation } from 'src/app/core/models';
import { AppRouter, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.page.html',
  styleUrls: ['./add-payment.page.scss'],
})
export class AddPaymentPage implements OnInit {
  @ViewChild(CommonDietFormComponent) commonForm: CommonDietFormComponent;
  @ViewChild(GasolineDietFormComponent) gasolineForm: GasolineDietFormComponent;

  toolbarTitle = 'Dieta y gastos';
  form: FormGroup;
  reservation: Reservation;
  photos: string[] = [];
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

  ngOnInit(): void {
    this.form = this.initFormGroup();
    this.resolveData();
  }

  async save() {
    const valid = this.isFormValid();
    if (!valid) {
      return;
    }

    const newPayment = this.getPaymentByType();
    this.dietService.createPayment(newPayment).subscribe({
      next: async (payment) => {
        this.photos.forEach((photo) => this.addDietPhotoToPayment(photo, payment.id));
        this.snacker.showSuccessful('La dieta ha sido añadida');
        await this.appRouter.goToMyDiets(this.reservation.id);
      },
      error: () => {
        this.snacker.showFailed('Error al añadir la dieta');
      },
    });
  }

  addDietPhotoToPayment(photo: string, payment: string) {
    this.dietService.addPhotoToPayment({ payment, photo }).subscribe({ next: () => {} });
  }

  async addPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      this.photos.push(image.dataUrl);
    } catch (error) {
      console.log('User did not take a photo');
    }
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
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
    const diet = this.dietId;
    const payment: CreatePayment = { diet, type, liters, amount, description };
    return payment;
  }

  private getCommonPayment() {
    const { amount, description } = this.commonForm.form.value;
    const type = this.paymentType.value;
    const diet = this.dietId;
    const payment: CreatePayment = { diet, type, amount, description };
    return payment;
  }

  private initFormGroup(): FormGroup {
    return this.fb.group({
      paymentType: ['', [Validators.required]],
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
}
