import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { DatetimeComponent } from 'src/app/components/datetime/datetime.component';
import { Diet, DietCollection, Reservation } from 'src/app/core/models';
import { AppRouter, DateZonerHelper, LoadingService, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-diets',
  templateUrl: './my-diets.page.html',
  styleUrls: ['./my-diets.page.scss'],
})
export class MyDietsPage implements OnInit {
  @ViewChild('start') start: DatetimeComponent;
  @ViewChild('end') end: DatetimeComponent;
  initStart: string;
  initEnd: string;

  toolbarTitle = 'Mis Dietas';
  reservation: Reservation;
  collection: DietCollection;
  diets: Diet[] = [];
  completed = false;

  constructor(
    private loadingSrv: LoadingService,
    private alertCtrl: AlertController,
    private dietService: DietService,
    private snacker: SnackerService,
    private zoner: DateZonerHelper,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {}

  ngOnInit() {
    this.resolveData();
    this.initDates();
  }

  goToAddDiet() {
    this.appRouter.goToAddDiet(this.reservation.id);
  }

  goToEditDiet(dietId: string) {
    this.appRouter.goToEditDiet(this.reservation.id, dietId);
  }

  async showDeleteDietAlert(event: any, dietId: string) {
    event.stopPropagation();
    const buttons = this.getAlertButtons(dietId);
    const alertElement = await this.alertCtrl.create({ message: '¿Esta seguro?', buttons });
    await alertElement.present(); // Mostrar al usuario
  }

  markCollectionAsCompleted() {
    const start = this.start.getDateSerialized();
    const end = this.end.getDateSerialized();
    this.dietService
      .patchDietCollection(this.collection.id, { start, end, completed: true })
      .subscribe({
        next: async () => {
          this.completed = true;
          await this.snacker.showSuccessful('Dieta completada correctamente');
        },
        error: async () => await this.snacker.showFailed('Error al completar dieta'),
      });
  }

  save() {
    const start = this.start.getDateSerialized();
    const end = this.end.getDateSerialized();
    this.dietService.patchDietCollection(this.collection.id, { start, end }).subscribe({
      next: async () => await this.snacker.showSuccessful('Dieta guardada correctamente'),
    });
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservation = response.reservation;
      this.collection = response.collection;
      this.completed = this.collection.completed;
      this.diets = this.collection.diets;
      this.serializeDiets();
    });
  }

  private initDates() {
    const start = new Date(this.collection.start);
    const end = new Date(this.collection.end);

    this.initStart = this.zoner.toMyZone(start);
    this.initEnd = this.zoner.toMyZone(end);
  }

  /**
   * Add a "photo" field. So it can be called in html like <img [src]="diet.photo" />
   */
  private serializeDiets() {
    this.diets = this.diets.map((diet) => this.serializeDiet(diet));
  }

  private serializeDiet(diet: Diet) {
    const photoRelativePath = diet.photos[0]?.photo;
    if (!photoRelativePath) {
      return diet;
    }
    const photoUrl = `${environment.fleetBaseUrl}${photoRelativePath}`;
    return { ...diet, photo: photoUrl };
  }

  // Delete diet
  private getAlertButtons(dietId: string) {
    return [
      { text: 'No', role: 'cancel' },
      { text: 'Si', handler: async () => await this.deleteDiet(dietId) },
    ];
  }

  private async deleteDiet(dietId: string) {
    await this.loadingSrv.present();
    this.dietService
      .deleteDiet(dietId)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe({
        next: async () => {
          await this.snacker.showSuccessful('Dieta eliminada correctamente');
          this.diets = this.diets.filter((diet) => diet.id !== dietId);
        },
        error: async () => await this.snacker.showFailed('Error al eliminar dieta'),
      });
  }
}
