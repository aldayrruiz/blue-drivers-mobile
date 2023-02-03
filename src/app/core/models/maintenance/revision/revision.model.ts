import { User } from '../../users/user.model';
import { Vehicle } from '../../vehicles/vehicle.model';

export interface Revision {
  id: string;
  owner: User;
  vehicle: Vehicle;
  date: string;
  kilometers: number;
  motive: string;
  garage: string;
  next_revision: string;
  next_kilometers: number;
  completed: boolean;
  last_updated: string;
  date_stored: string;
}
