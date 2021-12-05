export const GPS_MADRID: [number, number] = [40.423516, -4.202832];

export class MapConfiguration {
  id: string;
  position: [number, number];
  initialZoom: number;
  maxZoom: number;
  minZoom: number;

  constructor(
    id: string = 'map',
    position: [number, number] = GPS_MADRID,
    initialZoom: number = 6,
    maxZoom: number = 18,
    minZoom: number = 3
  ) {
    this.id = id;
    this.position = position;
    this.initialZoom = initialZoom;
    this.maxZoom = maxZoom;
    this.minZoom = minZoom;
  }
}
