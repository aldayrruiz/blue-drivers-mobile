import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { Position, Vehicle } from 'src/app/core/models';
import { AssetsService, PositionService } from 'src/app/core/services';
import { GnssIconProvider } from 'src/app/core/services/view/gnss-icon.service';
import { MapConfiguration } from 'src/app/core/utils/leaflet/map-configuration';
import { MapCreator } from 'src/app/core/utils/leaflet/map-creator';

interface MyMarker {
  vehicle: Vehicle;
  position: Position;
  marker: L.Marker;
}

const refreshTime = 20000;

@Component({
  selector: 'app-gnss',
  templateUrl: './gnss.page.html',
  styleUrls: ['./gnss.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnssPage implements OnInit, AfterViewInit {
  vehicleSelected: Vehicle;
  iconSrcSelected = '';
  positionUI: any;
  positionMarkers$: Observable<MyMarker[]>;
  toolbarTitle = 'GNSS';

  private icons = this.gnssIconProvider.getIconsPaths();
  private map: L.Map;
  private vehicles: Vehicle[];
  private positions;
  private positionMarkers: MyMarker[] = [];
  private positionMarkersSubject = new Subject<MyMarker[]>();

  constructor(
    private readonly gnssIconProvider: GnssIconProvider,
    private readonly positionSrv: PositionService,
    private readonly assetsSrv: AssetsService,
    private readonly route: ActivatedRoute
  ) {
    this.positionMarkers$ = this.positionMarkersSubject.asObservable();
  }

  ngOnInit() {
    this.listenForNewPositions();
    this.resolveData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.initMarkers(this.vehicles, this.positions);
    }, 400);
  }

  initMap(): void {
    // ! If not position DO NOT LOAD MAP. Try to load map in after few seconds.
    if (!this.positions) {
      setTimeout(async () => this.initMap(), refreshTime);
    } else {
      const { map } = MapCreator.create(new MapConfiguration());
      this.map = map;
    }
  }

  onVehicleSelectedChanged() {
    const deviceSelected = this.vehicleSelected.gps_device.id;
    const position = this.positions.find((pos) => pos.deviceId === deviceSelected);
    this.positionUI = { deviceTime: position.deviceTime, speed: position.speed };
    const marker = this.positionMarkers.find(
      (customMarker) => customMarker.vehicle === this.vehicleSelected
    ).marker;
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.iconSrcSelected = marker['_icon'].src;
  }

  private initMarkers(vehicles: Vehicle[], positions: Position[]) {
    const positionsMarkers = vehicles.map((vehicle) => {
      const icon = this.randomIcon();
      const position = this.findPosition(positions, vehicle);
      const marker = this.addMarkerToMap(position, icon);
      return { vehicle, position, marker };
    });
    this.updateMarkers(positionsMarkers);
    this.keepUpdatingMarkers(refreshTime);
  }

  private keepUpdatingMarkers(timeReset: number): void {
    setTimeout(() => {
      this.positionSrv.getAll().subscribe((positions) => {
        this.positions = this.getFakePositions();
        // this.positions = positions;
        const positionMarkers = this.positionMarkers.map((oldCustomMarker) => {
          const vehicle = oldCustomMarker.vehicle;
          const oldMarker = oldCustomMarker.marker;
          // * If marker is on map remove it and get his icon (to put the same). Otherwise do not anything.
          oldMarker?.remove();
          const icon = oldMarker?.getIcon() as L.Icon<L.IconOptions>;
          // * Set a new marker on map with previous icon or a new one.
          const position = this.findPosition(this.positions, vehicle);
          const marker = this.addMarkerToMap(position, icon);
          return { vehicle, position, marker };
        });
        this.updateMarkers(positionMarkers);
      });
      this.keepUpdatingMarkers(timeReset);
    }, timeReset);
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

  private resolveData(): void {
    this.route.data.subscribe((data) => {
      this.vehicles = data.vehicles;
      // this.positions = data.positions;
      this.positions = this.getFakePositions();
    });
  }

  private randomIcon() {
    return L.icon({
      iconUrl: this.assetsSrv.getUrl(this.icons.pop()),
      iconSize: [22, 22], // size of the icon
      iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
      popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    });
  }

  private findPosition(positions: Position[], vehicle: Vehicle) {
    return positions.find((pos) => pos.deviceId === vehicle.gps_device.id);
  }

  private latLng = (p: Position): [number, number] => [p.latitude, p.longitude];

  private updateMarkers(myMarkers: MyMarker[]) {
    this.positionMarkersSubject.next(myMarkers);
  }

  private listenForNewPositions() {
    this.positionMarkers$.subscribe((data) => {
      this.positionMarkers = data;
    });
  }

  private getFakePositions() {
    return [
      {
        latitude: Math.floor(Math.random() * 10),
        longitude: Math.floor(Math.random() * 10),
        deviceId: 20,
        deviceTime: new Date().toJSON(),
        speed: 'speed 1',
      },
      {
        latitude: Math.floor(Math.random() * 10),
        longitude: Math.floor(Math.random() * 10),
        deviceId: 24,
        deviceTime: new Date().toJSON(),
        speed: 'speed 2',
      },
    ];
  }
}
