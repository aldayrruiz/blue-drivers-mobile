/* eslint-disable @typescript-eslint/naming-convention */
import { IncidentType, Reservation, User } from '..';

export interface Incident {
  id: string;
  date_stored: string;
  description: string;
  owner: User;
  reservation: Reservation;
  type: IncidentType;
  photo: string;
}

export const getIncidentTypeLabel = (type: IncidentType) => {
  switch (type) {
    case IncidentType.BANG:
      return 'Choque';
    case IncidentType.LIGHTS:
      return 'Luces';
    case IncidentType.TIRE_PUNCTURE:
      return 'Pinchazo';
    case IncidentType.USAGE_PROBLEMS:
      return 'Problemas de uso';
    case IncidentType.OTHERS:
      return 'Otros';
  }
};
