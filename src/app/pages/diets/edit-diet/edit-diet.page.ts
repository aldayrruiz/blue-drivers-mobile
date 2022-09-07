import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonDietFormComponent } from 'src/app/components/diets/forms/common-diet-form/common-diet-form.component';
import { GasolineDietFormComponent } from 'src/app/components/diets/forms/gasoline-diet-form/gasoline-diet-form.component';
import { CreateDietPhoto, Diet, DietType, PatchDiet, Reservation } from 'src/app/core/models';
import { AppRouter, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-diet',
  templateUrl: './edit-diet.page.html',
  styleUrls: ['./edit-diet.page.scss'],
})
export class EditDietPage implements OnInit {
  @ViewChild(CommonDietFormComponent) commonForm: CommonDietFormComponent;
  @ViewChild(GasolineDietFormComponent) gasolineForm: GasolineDietFormComponent;

  toolbarTitle = 'Añadir Dieta';
  form: FormGroup;
  diet: Diet;

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

  get dietType(): AbstractControl {
    return this.form.get('dietType');
  }

  ngOnInit(): void {
    this.resolveData();
    this.form = this.initFormGroup();
  }

  async addDiet() {
    const valid = this.isFormValid();
    if (!valid) {
      return;
    }

    const newDiet = this.getDietByType();
    this.dietService.patchDiet(this.diet.id, newDiet).subscribe({
      next: async (diet) => {
        // Añadir las fotos nuevas.
        this.photos.forEach((photo) => this.addDietPhotoToDiet(photo, diet.id));
        // Eliminar las fotos antiguas.
        this.photosToRemove.forEach((photo) => this.deletePhotoPermanently(photo));
        await this.snacker.showSuccessful('Dieta actualizada');
        await this.appRouter.goToMyDiets(this.reservation.id);
      },
      error: () => {
        this.snacker.showFailed('Error al añadir la dieta');
      },
    });
  }

  deletePhotoPermanently(photo: CreateDietPhoto) {
    this.dietService.deleteDietPhoto(photo.id).subscribe({ next: () => {} });
  }

  addDietPhotoToDiet(photo: string, diet: string) {
    this.dietService.addDietPhotoToDiet({ diet, photo }).subscribe({ next: () => {} });
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

  private getDietByType() {
    switch (this.dietType.value) {
      case DietType.Gasolina:
        return this.getGasolineDiet();
      default:
        return this.getCommonDiet();
    }
  }

  private getGasolineDiet() {
    const { liters, amount, description } = this.gasolineForm.form.value;
    const type = DietType.Gasolina;
    const diet: PatchDiet = { type, liters, amount, description };
    return diet;
  }

  private getCommonDiet() {
    const { amount, description } = this.commonForm.form.value;
    const type = this.dietType.value;
    const diet: PatchDiet = { type, amount, description };
    return diet;
  }

  private initFormGroup(): FormGroup {
    return this.fb.group({
      dietType: [this.diet.type, [Validators.required]],
    });
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.diet = response.diet;
      this.reservation = response.reservation;
      this.initPhotos = this.diet.photos.map((photo) => this.serializerDietPhoto(photo));
    });
  }

  private isFormValid() {
    if (!this.dietType.value) {
      this.snacker.showFailed('Selecciona un tipo de dieta');
      return false;
    }
    switch (this.dietType.value) {
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

  private serializerDietPhoto(dietPhoto: CreateDietPhoto) {
    const photoRelativePath = dietPhoto.photo;
    const url = `${environment.fleetBaseUrl}${photoRelativePath}`;
    return { ...dietPhoto, url };
  }
}
