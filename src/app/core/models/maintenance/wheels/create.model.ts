import { WheelsLocation } from './location.model';
import { WheelsOperation } from './operation.model';

export interface CreateWheels {
  id?: string;
  vehicle: string;
  date: string;
  location: WheelsLocation;
  kilometers: number;
  operation: WheelsOperation;
  passed: boolean;
  completed?: boolean;
}
