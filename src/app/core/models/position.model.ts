// Data from Traccar API https://www.traccar.org/api-reference/#tag/Positions
// All data is received by this interface, except network and attributes (not useful by the moment).

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  deviceTime: string;
  fixTime: string;
  serverTime: string;
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address: string;
  accuracy: number;
}
