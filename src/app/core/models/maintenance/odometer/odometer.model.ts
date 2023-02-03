import { User } from '../../users/user.model';
import { Vehicle } from '../../vehicles/vehicle.model';

export interface Odometer {
  id: string;
  owner: User;
  vehicle: Vehicle;
  date: string;
  kilometers: number;
  completed: boolean;
  last_updated: string;
  date_stored: string;
}
