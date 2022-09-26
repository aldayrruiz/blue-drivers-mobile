export enum VehicleType {
  TOURISM = 'TOURISM',
  ALL_TERRAIN = 'ALL_TERRAIN',
  MOTORCYCLE = 'MOTORCYCLE',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
}

export const vehicleTypeLabel = (type: VehicleType) => {
  switch (type) {
    case VehicleType.TOURISM:
      return 'Turismo';
    case VehicleType.ALL_TERRAIN:
      return 'Todoterreno';
    case VehicleType.MOTORCYCLE:
      return 'Motocicleta';
    case VehicleType.VAN:
      return 'Furgoneta';
    case VehicleType.TRUCK:
      return 'Camión';
  }
};
