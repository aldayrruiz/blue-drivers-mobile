import { Router } from '@angular/router';

const extras = { replaceUrl: true };

export class Ghost {
  public static async goToReservationDetails(router: Router, id: string) {
    const to = `members/my-reservations/${id}`;
    return router.navigateByUrl(to, extras);
  }

  public static async goToVehiclesDetails(router: Router, id: string) {
    const to = `members/vehicles/${id}`;
    return router.navigateByUrl(to, extras);
  }
}
