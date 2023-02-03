import { User } from '../../users/user.model';
import { Vehicle } from '../../vehicles/vehicle.model';

export interface Itv {
  id: string;
  owner: User;
  vehicle: Vehicle;
  date: string;
  place: string;
  passed: boolean;
  next_revision: string;
  completed: boolean;
  last_updated: string;
  date_stored: string;
}
