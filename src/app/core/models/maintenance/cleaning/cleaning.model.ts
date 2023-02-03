import { User } from '../../users/user.model';
import { Vehicle } from '../../vehicles/vehicle.model';
import { CleaningType } from './type.model';

export interface Cleaning {
  id: string;
  owner: User;
  vehicle: Vehicle;
  date: string;
  type: CleaningType;
  completed: boolean;
  last_updated: string;
  date_stored: string;
}
