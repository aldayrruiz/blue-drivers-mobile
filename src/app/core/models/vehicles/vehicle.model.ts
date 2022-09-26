/* eslint-disable @typescript-eslint/naming-convention */

import { Device, InsuranceCompany, VehicleFuel, VehicleType } from '..';

/**
 * This interface is used to charge a list of vehicles.
 * As you can see it does not have reservations field.
 */
export interface Vehicle {
  id: string;
  name: string;
  date_stored: string;
  brand: string;
  model: string;
  gps_device: Device;
  number_plate: string;
  fuel: VehicleFuel;
  type: VehicleType;
  insurance_company: InsuranceCompany;
  policy_number: string;
  icon: number;
}
