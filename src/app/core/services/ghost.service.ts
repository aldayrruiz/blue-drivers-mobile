import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GhostService {
  extras = { replaceUrl: true };

  constructor(private router: Router) {}

  async goToReservationDetails(id: string) {
    const to = `members/my-reservations/${id}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToVehiclesDetails(id: string) {
    const to = `members/vehicles/${id}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToIncidentDetails(id: string) {
    const to = `members/my-incidents/${id}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToTicketDetails(id: string) {
    const to = `members/my-tickets/${id}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goBack(route: ActivatedRoute) {
    return this.router.navigate(['..'], { relativeTo: route });
  }
}
