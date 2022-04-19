import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, IsActiveMatchOptions, Router } from '@angular/router';
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
  iconUrl: string;
}

const refreshTime = 5000;

@Component({
  selector: 'app-gnss',
  templateUrl: './gnss.page.html',
  styleUrls: ['./gnss.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnssPage implements OnInit, AfterViewInit {
  vehicleSelected: Vehicle;
  iconSrcSelected = '';
  positionMarkers$: Observable<MyMarker[]>;
  toolbarTitle = 'GNSS';
  expanded: boolean[];

  private icons: string[];
  private map: L.Map;
  private vehicles: Vehicle[];
  private positions;
  private positionMarkers: MyMarker[] = [];
  private positionMarkersSubject = new Subject<MyMarker[]>();

  constructor(
    private readonly gnssIconProvider: GnssIconProvider,
    private readonly positionSrv: PositionService,
    private readonly assetsSrv: AssetsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.positionMarkers$ = this.positionMarkersSubject.asObservable();
  }

  getMyMarkerInit(icon: string): MyMarker {
    const leafIcon = this.getLeafIcon(icon);
    const iconUrl = leafIcon.options.iconUrl;
    return { vehicle: null, position: null, marker: null, iconUrl };
  }

  ngOnInit() {
    this.icons = this.gnssIconProvider.getIconsPaths();
    this.expanded = new Array(this.icons.length).fill(false);
    this.listenForNewPositions();
    this.resolveData();
    const initPositionMarkers = this.icons.map((icon) => this.getMyMarkerInit(icon));
    this.updateMarkers(initPositionMarkers);
  }

  toggle(i: number) {
    this.expanded[i] = !this.expanded[i];
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

  private initMarkers(vehicles: Vehicle[], positions: Position[]) {
    const positionsMarkers = vehicles.map((vehicle, i) => {
      const leafIcon = this.getLeafIcon(this.icons[i]);
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
        const positionMarkers = this.positionMarkers.map((oldCustomMarker, i) => {
          const vehicle = oldCustomMarker.vehicle;
          const oldMarker = oldCustomMarker.marker;
          // * If marker is on map remove it and get his icon (to put the same). Otherwise do not anything.
          oldMarker?.remove();
          const icon =
            (oldMarker?.getIcon() as L.Icon<L.IconOptions>) || this.getLeafIcon(this.icons[i]);
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
    const marker = L.marker(latLng, { icon }).addTo(this.map);
    return marker;
  }

  private resolveData(): void {
    this.route.data.subscribe((data) => {
      this.vehicles = data.vehicles;
      this.positions = data.positions;
      // this.positions = this.getFakePositions();
    });
  }

  private getLeafIcon(icon: string) {
    const iconUrl = this.assetsSrv.getUrl(icon);
    return L.icon({
      iconUrl,
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

  private isThisPageActive() {
    const options: IsActiveMatchOptions = {
      matrixParams: 'exact',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'exact',
    };
    const isActive = this.router.isActive('/members/gnss', options);
    return isActive;
  }

  private getFakePositions() {
    return [
      {
        latitude: Math.floor(Math.random() * 10),
        longitude: Math.floor(Math.random() * 10),
        deviceId: 1,
        deviceTime: new Date('2022-04-03T18:09:04.067Z').toJSON(),
        speed: 10,
      },
      {
        latitude: Math.floor(Math.random() * 10),
        longitude: Math.floor(Math.random() * 10),
        deviceId: 24,
        deviceTime: new Date('2022-04-02T18:09:04.067Z').toJSON(),
        speed: 20,
      },
      {
        latitude: Math.floor(Math.random() * 10),
        longitude: Math.floor(Math.random() * 10),
        deviceId: 67,
        deviceTime: new Date('2022-03-03T18:09:04.067Z').toJSON(),
        speed: 30,
      },
    ];
  }
}
