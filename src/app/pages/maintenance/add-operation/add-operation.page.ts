import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatetimeComponent } from 'src/app/components/datetime/datetime.component';
import { CleaningFormComponent } from 'src/app/components/maintenance/cleaning-form/cleaning-form.component';
import { ItvFormComponent } from 'src/app/components/maintenance/itv-form/itv-form.component';
import { OdometerFormComponent } from 'src/app/components/maintenance/odometer-form/odometer-form.component';
import { RevisionFormComponent } from 'src/app/components/maintenance/revision-form/revision-form.component';
import { WheelsFormComponent } from 'src/app/components/maintenance/wheels-form/wheels-form.component';
import { PhotosComponent } from 'src/app/components/photos/photos.component';
import {
  CleaningPhoto,
  CreateCleaning,
  CreateItv,
  CreateOdometer,
  CreateRevision,
  ItvPhoto,
  MaintenanceOperationType,
  OdometerPhoto,
  RevisionPhoto,
  Vehicle,
  WheelsPhoto,
} from 'src/app/core/models';
import { CreateWheels } from 'src/app/core/models/maintenance/wheels/create.model';
import { AppRouter, DateZonerHelper, SnackerService } from 'src/app/core/services';
import { MaintenanceService } from 'src/app/core/services/api/maintenance.service';

interface CommonData {
  date: string;
  vehicle: string;
}

@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.page.html',
  styleUrls: ['./add-operation.page.scss'],
})
export class AddOperationPage implements OnInit {
  @ViewChild('date') datetimeComponent: DatetimeComponent;

  @ViewChild('cleaningForm') cleaningFormComponent: CleaningFormComponent;
  @ViewChild('itvForm') itvFormComponent: ItvFormComponent;
  @ViewChild('odometerForm') odometerFormComponent: OdometerFormComponent;
  @ViewChild('revisionForm') revisionFormComponent: RevisionFormComponent;
  @ViewChild('wheelsForm') wheelsFormComponent: WheelsFormComponent;

  @ViewChild('photos') photosComponent: PhotosComponent;

  // Init
  operationType: MaintenanceOperationType = MaintenanceOperationType.Cleaning;
  initDate: string;
  vehicle: Vehicle;
  toolbarTitle = 'Mantenimiento';

  constructor(
    private snacker: SnackerService,
    private zoner: DateZonerHelper,
    private route: ActivatedRoute,
    private appRouter: AppRouter,
    private maintenanceService: MaintenanceService
  ) {}

  ngOnInit() {
    this.resolveData();
    this.initDates();
  }

  save() {
    const date = this.datetimeComponent.getDateSerialized();
    const vehicle = this.vehicle.id;
    const commonData = { date, vehicle };

    switch (this.operationType) {
      case MaintenanceOperationType.Cleaning:
        this.saveCleaning(commonData);
        break;
      case MaintenanceOperationType.Itv:
        this.saveItv(commonData);
        break;
      case MaintenanceOperationType.Odometer:
        this.saveOdometer(commonData);
        break;
      case MaintenanceOperationType.Revision:
        this.saveRevision(commonData);
        break;
      case MaintenanceOperationType.Wheels:
        this.saveWheels(commonData);
        break;
    }
  }

  private saveCleaning(commonData: CommonData) {
    const errors = this.cleaningFormComponent.getErrors();
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }

    const cleaningData = this.cleaningFormComponent.getData();
    const data: CreateCleaning = { ...commonData, ...cleaningData };
    this.maintenanceService.createCleaning(data).subscribe({
      next: (cleaning: CreateCleaning) => {
        const photos = this.getPhotosToAddToCleaning(cleaning.id);
        photos.forEach((photo) => {
          this.maintenanceService.addPhotosToCleaning(photo).subscribe();
        });
        this.snacker.showSuccessful('Limpieza creada correctamente');
        this.appRouter.goToMaintenance();
      },
    });
  }

  private saveItv(commonData: CommonData) {
    const errors = this.itvFormComponent.getErrors();
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }
    const itvData = this.itvFormComponent.getData();
    const data: CreateItv = { ...commonData, ...itvData };
    this.maintenanceService.createItv(data).subscribe({
      next: (itv: CreateItv) => {
        const photos = this.getPhotosToAddToItv(itv.id);
        photos.forEach((photo) => {
          this.maintenanceService.addPhotosToItv(photo).subscribe();
        });
        this.snacker.showSuccessful('ITV creada correctamente');
        this.appRouter.goToMaintenance();
      },
    });
  }

  private saveOdometer(commonData: CommonData) {
    const errors = this.odometerFormComponent.getErrors();
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }
    const odometerData = this.odometerFormComponent.getData();
    const data: CreateOdometer = { ...commonData, ...odometerData };
    this.maintenanceService.createOdometer(data).subscribe({
      next: (odometer) => {
        const photos = this.getPhotosToAddToOdometer(odometer.id);
        photos.forEach((photo) => {
          this.maintenanceService.addPhotosToOdometer(photo).subscribe();
        });
        this.snacker.showSuccessful('Kilometraje creado correctamente');
        this.appRouter.goToMaintenance();
      },
    });
  }

  private saveRevision(commonData: CommonData) {
    const errors = this.revisionFormComponent.getErrors();
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }
    const revisionData = this.revisionFormComponent.getData();
    const data: CreateRevision = { ...commonData, ...revisionData };
    this.maintenanceService.createRevision(data).subscribe({
      next: (revision: CreateRevision) => {
        const photos = this.getPhotosToAddToRevision(revision.id);
        photos.forEach((photo) => {
          this.maintenanceService.addPhotosToRevision(photo).subscribe();
        });
        this.snacker.showSuccessful('Revisión creada correctamente');
        this.appRouter.goToMaintenance();
      },
    });
  }

  private saveWheels(commonData: CommonData) {
    const errors = this.wheelsFormComponent.getErrors();
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }
    const wheelsData = this.wheelsFormComponent.getData();
    const data: CreateWheels = { ...commonData, ...wheelsData };
    this.maintenanceService.createWheels(data).subscribe({
      next: (wheels: CreateWheels) => {
        const photos = this.getPhotosToAddToWheels(wheels.id);
        photos.forEach((photo) => {
          this.maintenanceService.addPhotosToWheels(photo).subscribe();
        });
        this.snacker.showSuccessful('Neumáticos creadas correctamente');
        this.appRouter.goToMaintenance();
      },
    });
  }

  private getPhotosToAddToCleaning(cleaning: string): CleaningPhoto[] {
    return this.photosComponent.photos.map((photo) => ({ cleaning, photo }));
  }

  private getPhotosToAddToItv(itv: string): ItvPhoto[] {
    return this.photosComponent.photos.map((photo) => ({ itv, photo }));
  }

  private getPhotosToAddToRevision(revision: string): RevisionPhoto[] {
    return this.photosComponent.photos.map((photo) => ({ revision, photo }));
  }

  private getPhotosToAddToOdometer(odometer: string): OdometerPhoto[] {
    return this.photosComponent.photos.map((photo) => ({ odometer, photo }));
  }

  private getPhotosToAddToWheels(wheels: string): WheelsPhoto[] {
    return this.photosComponent.photos.map((photo) => ({ wheels, photo }));
  }

  private showErrors(errors: string[]) {
    for (const error of errors) {
      this.snacker.showFailed(error);
      return;
    }
  }

  private initDates() {
    const now = new Date();
    this.initDate = this.zoner.toMyZone(now);
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.vehicle = response.vehicle;
    });
  }
}
