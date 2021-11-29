import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { finalize } from 'rxjs/operators';
import { Position, Reservation, Vehicle } from 'src/app/core/models';
import {
  AssetsService,
  ErrorMessageService,
  LoadingService,
  MyDateService,
  MyReservationsTabStorage,
  ReservationService,
  SnackerService,
} from 'src/app/core/services';
import { PositionService } from 'src/app/core/services/position.service';
import { MapConfiguration } from 'src/app/shared/utils/leaflet/map-configuration';
import { MapCreator } from 'src/app/shared/utils/leaflet/map-creator';

const REFRESH_LOCATION_TIME = 60000;

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.page.html',
  styleUrls: ['./reservation-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDetailsPage implements OnInit, AfterViewInit {
  getTimeReserved = this.dateSrv.getTimeReserved;
  reservation: Reservation;
  vehicle: Vehicle;
  private positions: Position[];
  private map: L.Map;
  private marker: L.Marker;

  constructor(
    private reservationService: ReservationService,
    private tabStorage: MyReservationsTabStorage,
    private errorMessage: ErrorMessageService,
    private positionSrv: PositionService,
    private alertCtrl: AlertController,
    private loadingSrv: LoadingService,
    private assetsSrv: AssetsService,
    private snacker: SnackerService,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.addMarkerAndKeepUpdating();
    }, 400);
  }

  ngOnInit(): void {
    this.resolveData();
  }

  alreadyStarted(reservation: Reservation): boolean {
    const start = new Date(reservation.start);
    const now = new Date();

    return start <= now;
  }

  async showCancelReservationAlert(): Promise<void> {
    const buttons = this.getAlertButtons();
    const alertElement = await this.alertCtrl.create({
      message: '¿Esta seguro?',
      buttons,
    });

    await alertElement.present(); // Mostrar al usuario
  }

  private storeReservationInTab() {
    this.tabStorage.setCurrentReservation(this.reservation);
  }

  private async cancelReservation(subsequentReservations: boolean) {
    await this.loadingSrv.present();

    this.reservationService
      .delete(this.reservation.id, subsequentReservations)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          const message = 'Operación realizada con exito';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
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

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservation = response.reservation;
      this.positions = response.positions;
      this.vehicle = this.reservation.vehicle;
      this.storeReservationInTab();
    });
  }

  private initMap(): void {
    const { tiles, map } = MapCreator.create(new MapConfiguration());
    this.map = map;
  }

  private findPosition(positions: Position[], vehicle: Vehicle) {
    return positions.find((pos) => pos.deviceId === vehicle.gps_device.id);
  }

  private addMarkerAndKeepUpdating() {
    const position = this.findPosition(this.positions, this.vehicle);
    const icon = this.randomIcon();
    this.marker = this.addMarkerToMap(position, icon);
    const latLng = this.marker.getLatLng();
    this.map.panTo(latLng);
    this.keepUpdating();
  }

  private keepUpdating() {
    setTimeout(() => {
      this.positionSrv.getAll().subscribe((positions) => {
        this.marker?.removeFrom(this.map);
        const icon = this.marker?.getIcon() as L.Icon<L.IconOptions>;
        const position = this.findPosition(positions, this.vehicle);
        this.marker = this.addMarkerToMap(position, icon);
        const latLng = this.marker.getLatLng();
        this.map.panTo(latLng);
      });
      this.keepUpdating();
    }, REFRESH_LOCATION_TIME);
  }

  private addMarkerToMap(position: Position, icon?: L.Icon<L.IconOptions>) {
    if (!position) {
      return undefined;
    }

    if (!icon) {
      icon = this.randomIcon();
    }

    const latLng = this.latLng(position);
    const marker = L.marker(latLng, { icon }).addTo(this.map);
    return marker;
  }

  private latLng = (p: Position): [number, number] => [p.latitude, p.longitude];

  private randomIcon() {
    return L.icon({
      iconUrl: this.assetsSrv.getUrl(this.icons.pop()),
      iconSize: [22, 22], // size of the icon
      iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
      popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private icons = [
    'icon/pink-car.png',
    'icon/light-green-car.png',
    'icon/light-blue-car.png',
    'icon/brown-car.png',
    'icon/orange-car.png',
    'icon/yellow-car.png',
    'icon/green-car.png',
    'icon/red-car.png',
    'icon/blue-car.png',
    'icon/black-car.png',
  ];
}
