import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, IsActiveMatchOptions, Router } from '@angular/router';
import * as L from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { Position, Vehicle } from 'src/app/core/models';
import { PositionService, VehicleIconProvider } from 'src/app/core/services';
import { MapConfiguration } from 'src/app/core/utils/leaflet/map-configuration';
import { MapCreator } from 'src/app/core/utils/leaflet/map-creator';

interface MyMarker {
  vehicle: Vehicle;
  position: Position;
  marker: L.Marker;
  iconUrl: string;
}

const refreshTime = 10000;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPage implements OnInit, AfterViewInit {
  positionMarkers$: Observable<MyMarker[]>;
  toolbarTitle = 'Mapa';
  expanded: boolean[];

  private map: L.Map;
  private vehicles: Vehicle[];
  private positions: Position[];
  private positionMarkers: MyMarker[] = [];
  private positionMarkersSubject: Subject<MyMarker[]> = new Subject<MyMarker[]>();

  constructor(
    private vehicleIconProvider: VehicleIconProvider,
    private positionSrv: PositionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.positionMarkers$ = this.positionMarkersSubject.asObservable();
  }

  ngOnInit() {
    this.listenForNewPositions();
    this.resolveData();
    const initPositionMarkers: MyMarker[] = this.vehicles.map((vehicle: Vehicle) => {
      const icon: string = this.getIconFromVehicle(vehicle);
      return this.getMyMarkerInit(icon);
    });
    this.updateMarkers(initPositionMarkers);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.initMarkers(this.vehicles, this.positions);
      this.focusMapOnPosition(this.positionMarkers[0]);
    }, 400);
  }

  getMyMarkerInit(icon: string): MyMarker {
    const leafIcon = this.createLeafIcon(icon);
    const iconUrl = leafIcon.options.iconUrl;
    return { vehicle: null, position: null, marker: null, iconUrl };
  }

  focusMapOnPosition(positionMarker: MyMarker) {
    this.map.setView(positionMarker.marker.getLatLng(), 15);
  }

  private initMap(): void {
    // ! If not position DO NOT LOAD MAP. Try to load map in after few seconds.
    if (!this.positions) {
      setTimeout(async () => this.initMap(), refreshTime);
    } else {
      const { map } = MapCreator.create(new MapConfiguration());
      this.map = map;
    }
  }

  private initMarkers(vehicles: Vehicle[], positions: Position[]) {
    const positionsMarkers = vehicles.map((vehicle) => {
      const icon = this.getIconFromVehicle(vehicle);
      const leafIcon = this.createLeafIcon(icon);
      const position = this.findPosition(positions, vehicle);
      const marker = this.addMarkerToMap(position, leafIcon);
      const iconUrl = leafIcon.options.iconUrl;
      return { vehicle, position, marker, iconUrl, active: true };
    });
    this.updateMarkers(positionsMarkers);
    this.keepUpdatingMarkers(refreshTime);
  }

  private keepUpdatingMarkers(timeReset: number): void {
    if (!this.isThisPageActive()) {
      // Stop sending request to server to get new positions.
      return;
    }

    setTimeout(() => {
      this.positionSrv.getAll().subscribe((positions) => {
        this.positions = positions;
        // this.positions = this.getFakePositions();
        const positionMarkers = this.positionMarkers.map((oldCustomMarker: MyMarker) => {
          const vehicle = oldCustomMarker.vehicle;
          const oldMarker = oldCustomMarker.marker;
          // * If marker is on map remove it and get his icon (to put the same). Otherwise, do not anything.
          oldMarker?.remove();
          const icon = oldMarker?.getIcon() as L.Icon<L.IconOptions>;
          // * Set a new marker on map with previous icon or a new one.
          const position = this.findPosition(this.positions, vehicle);
          const marker = this.addMarkerToMap(position, icon);
          const iconUrl = icon.options.iconUrl;
          return { vehicle, position, marker, iconUrl };
        });
        this.updateMarkers(positionMarkers);
      });
      this.keepUpdatingMarkers(timeReset);
    }, timeReset);
  }

  private addMarkerToMap(position: Position, icon: L.Icon<L.IconOptions>) {
    if (!position) {
      return undefined;
    }

    const latLng = this.latLng(position);
    return L.marker(latLng, { icon }).addTo(this.map);
  }

  private resolveData(): void {
    this.route.data.subscribe((data) => {
      this.vehicles = data.vehicles;
      this.positions = data.positions;
      // this.positions = this.getFakePositions();
    });
  }

  private createLeafIcon(iconSrc: string) {
    return L.icon({
      iconUrl: iconSrc,
      iconSize: [22, 22], // size of the icon
      iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
      popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
      className: 'leaflet-vehicle-icon',
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

  private isThisPageActive() {
    const options: IsActiveMatchOptions = {
      matrixParams: 'exact',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'exact',
    };
    const isActive = this.router.isActive('/members/map', options);
    return isActive;
  }

  private getFakePositions() {
    return [
      {
        latitude: this.generateLatitude(),
        longitude: this.generateLongitude(),
        deviceId: 1,
        deviceTime: new Date('2022-04-03T18:09:04.067Z').toJSON(),
        speed: 10,
      },
      {
        latitude: this.generateLatitude(),
        longitude: this.generateLongitude(),
        deviceId: 2,
        deviceTime: new Date('2022-04-02T18:09:04.067Z').toJSON(),
        speed: 20,
      },
      {
        latitude: this.generateLatitude(),
        longitude: this.generateLongitude(),
        deviceId: 3,
        deviceTime: new Date('2022-03-03T18:09:04.067Z').toJSON(),
        speed: 30,
      },
    ];
  }

  private generateLatitude() {
    return Math.floor(Math.random() * (43 - 40 + 1) + 40);
  }

  private generateLongitude() {
    return Math.floor(Math.random() * (-5 + 8 + 1) - 5);
  }

  private getIconFromVehicle(vehicle: Vehicle): string {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }
}
