/* eslint-disable @typescript-eslint/naming-convention */
export enum VehicleFuel {
  DIESEL = 'DIESEL',
  GASOLINE = 'GASOLINE',
  ELECTRIC = 'ELECTRIC',
}

export const fuelLabel = (fuel: VehicleFuel) => {
  switch (fuel) {
    case VehicleFuel.DIESEL:
      return 'Diesel';
    case VehicleFuel.GASOLINE:
      return 'Gasolina';
    case VehicleFuel.ELECTRIC:
      return 'Eléctrico';
  }
};
