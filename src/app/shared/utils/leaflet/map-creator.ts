import * as L from 'leaflet';
import { MapConfiguration } from './map-configuration';

const attribution =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export class MapCreator {
  public static create(configuration: MapConfiguration) {
    const { id, position, initialZoom, maxZoom, minZoom } = configuration;
    const map = L.map(id).setView(position, initialZoom);

    const tiles = L.tileLayer(urlTemplate, {
      maxZoom,
      minZoom,
      attribution,
    });

    tiles.addTo(map);

    return { tiles, map };
  }
}
