import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { finalize } from 'rxjs/operators';
import { Position, Recurrent, Reservation, Vehicle } from 'src/app/core/models';
import {
  AssetsService,
  ErrorMessageService,
  LoadingService,
  MyDateService,
  MyReservationsTabStorage,
  PositionService,
  ReservationService,
  SnackerService,
  VehicleIcon,
  VehicleIconProvider,
  WeekdaysService,
} from 'src/app/core/services';
import { MapConfiguration } from 'src/app/core/utils/leaflet/map-configuration';
import { MapCreator } from 'src/app/core/utils/leaflet/map-creator';

const REFRESH_LOCATION_TIME = 10_000; // 10 sec.
const vehicleIcon = 'icon/vehicles/vehicle.png';
const userIcon = 'icon/users/user.png';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.page.html',
  styleUrls: ['./reservation-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDetailsPage implements OnInit, AfterViewInit {
  toolbarTitle = 'Mis reservas';
  getTimeReserved = this.dateSrv.getTimeReserved;
  reservation: Reservation;
  recurrent: Recurrent;
  weekdays: string[];
  vehicle: Vehicle;
  private positions: Position[];
  private map: L.Map;
  private vehicleMarker: L.Marker;
  private userMarker: L.Marker;
  private userIcon: L.Icon<L.IconOptions>;
  private vehicleIcon: L.Icon<L.IconOptions>;
  private icons: VehicleIcon[];

  constructor(
    private vehicleIconProvider: VehicleIconProvider,
    private reservationService: ReservationService,
    private tabStorage: MyReservationsTabStorage,
    private errorMessage: ErrorMessageService,
    private positionSrv: PositionService,
    private weekdaysSrv: WeekdaysService,
    private alertCtrl: AlertController,
    private loadingSrv: LoadingService,
    private assetsSrv: AssetsService,
    private snacker: SnackerService,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit(): void {
    this.initIcons();
    this.resolveData();
  }

  ngAfterViewInit(): void {
    if (this.isReservationOccurringNow()) {
      setTimeout(async () => {
        await this.initMap();
        this.addVehicleMarkerAndKeepUpdating();
        await this.initUserMarker();
      }, 400);
    }
  }

  isReservationOccurringNow() {
    const start = new Date(this.reservation.start);
    const end = new Date(this.reservation.end);
    const now = new Date();
    start.setMinutes(start.getMinutes() - 60);
    return start < now && now < end;
  }

  alreadyStarted(reservation: Reservation): boolean {
    const start = new Date(reservation.start);
    const now = new Date();

    return start <= now;
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }

  async showCancelAlert() {
    const buttons = this.getAlertButtons();
    const alertElement = await this.alertCtrl.create({
      message: '¿Esta seguro?',
      buttons,
    });

    await alertElement.present(); // Mostrar al usuario
  }

  differentDay(event): boolean {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return start.getUTCDay() !== end.getUTCDay();
  }

  private storeReservationInTab() {
    this.tabStorage.setCurrentReservation(this.reservation);
  }

  private getAlertButtons() {
    const buttons = [
      {
        text: 'No',
        role: 'cancel',
      },
      {
        text: 'Si',
        handler: async () => await this.cancelReservation(false),
      },
    ];

    const cancelRecurrentButton = {
      text: 'Si y posteriores',
      handler: async () => await this.cancelReservation(true),
    };

    if (this.reservation.is_recurrent) {
      buttons.push(cancelRecurrentButton);
    }

    return buttons;
  }

  private async cancelReservation(subsequentReservations: boolean) {
    await this.loadingSrv.present();

    this.reservationService
      .delete(this.reservation.id, subsequentReservations)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          const message = 'Operación realizada con éxito';
          this.snacker.showSuccessful(message);
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          this.snacker.showFailed(message);
        }
      );
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservation = response.reservation;
      this.positions = response.positions;
      this.vehicle = this.reservation.vehicle;
      this.recurrent = this.reservation.recurrent;
      this.weekdays = this.getWeekDaysLabels(this.recurrent);
      this.storeReservationInTab();
    });
  }

  private async initMap() {
    const position = this.findPosition(this.positions, this.vehicle);
    // ! If not position DO NOT LOAD MAP. Try to load map in after few seconds.
    if (!position) {
      setTimeout(async () => {
        await this.initMap();
      }, REFRESH_LOCATION_TIME);
    } else {
      const latLng = this.latLng(position);
      const { map } = MapCreator.create(new MapConfiguration('map', latLng, 15));
      this.map = map;
    }
  }

  private findPosition(positions: Position[], vehicle: Vehicle) {
    return positions.find((pos) => pos.deviceId === vehicle.gps_device.id);
  }

  private addVehicleMarkerAndKeepUpdating() {
    const position = this.findPosition(this.positions, this.vehicle);
    console.assert(Boolean(position), 'Vehicle position not received.');
    if (position) {
      const latLng = this.latLng(position);
      this.vehicleMarker = this.addMarkerToMap(latLng, this.vehicleIcon);
    }
    this.keepVehicleMarkerUpdating();
  }

  private keepVehicleMarkerUpdating() {
    setTimeout(() => {
      if (!this.isThisPageActive()) {
        return;
      }
      this.positionSrv.getAll().subscribe((positions) => {
        this.vehicleMarker?.removeFrom(this.map);
        const position = this.findPosition(positions, this.vehicle);
        console.assert(Boolean(position), 'Vehicle position not received.');
        if (position) {
          const { latitude, longitude } = position;
          this.vehicleMarker = this.addMarkerToMap([latitude, longitude], this.vehicleIcon);
        }
      });
      this.keepVehicleMarkerUpdating();
    }, REFRESH_LOCATION_TIME);
  }

  private isThisPageActive() {
    const url = `/members/my-reservations/${this.reservation.id}`;
    return this.router.url === url;
  }

  private addMarkerToMap([lat, lng]: [number, number], icon: any) {
    if (!lat || !lng) {
      return undefined;
    }

    const marker = L.marker([lat, lng], { icon }).addTo(this.map);
    return marker;
  }

  private latLng = (p: Position): [number, number] => [p.latitude, p.longitude];

  private async initUserMarker() {
    await this.updateUserMarker();
    this.keepUpdatingUserMarker();
  }

  private async keepUpdatingUserMarker() {
    setTimeout(async () => {
      if (!this.isThisPageActive()) {
        return;
      }
      await this.updateUserMarker();
      this.keepUpdatingUserMarker();
    }, REFRESH_LOCATION_TIME);
  }

  private async updateUserMarker() {
    this.userMarker?.removeFrom(this.map);
    const { latitude, longitude } = await this.getUserPosition();
    console.assert(Boolean(latitude), 'User position not received.');
    this.userMarker = this.addMarkerToMap([latitude, longitude], this.userIcon);
  }

  private async getUserPosition() {
    const { latitude, longitude } = (await Geolocation.getCurrentPosition()).coords;
    return { latitude, longitude };
  }

  private initIcons() {
    this.userIcon = this.createIcon(userIcon);
    this.vehicleIcon = this.createIcon(vehicleIcon);
  }

  private createIcon(url: string) {
    return L.icon({
      iconUrl: this.assetsSrv.getUrl(url),
      iconSize: [22, 22], // size of the icon
      iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
      popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    });
  }

  private getWeekDaysLabels(recurrent: Recurrent) {
    if (!recurrent) {
      return [];
    }
    const weekdays = recurrent.weekdays.split(',');
    const labels = weekdays
      .map((weekday) => parseInt(weekday, 10))
      .map((weekday) => this.weekdaysSrv.getWeekDayLabel(weekday));

    return labels;
  }
}
