import { User } from '../../users/user.model';
import { Vehicle } from '../../vehicles/vehicle.model';
import { WheelsLocation } from './location.model';
import { WheelsOperation } from './operation.model';

export interface Wheels {
  id: string;
  owner: User;
  vehicle: Vehicle;
  date: string;
  location: WheelsLocation;
  kilometers: number;
  operation: WheelsOperation;
  passed: boolean;
  completed: boolean;
  last_updated: string;
  date_stored: string;
}
