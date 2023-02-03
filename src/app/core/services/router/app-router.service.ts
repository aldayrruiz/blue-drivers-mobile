import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppRouter {
  extras = { replaceUrl: true };

  constructor(private router: Router) {}

  async goTo(to: string) {
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToHome() {
    const to = `/members/home`;
    this.router.navigateByUrl(to, this.extras);
  }

  async goToMyReservations() {
    const to = `/members/my-reservations`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToMyReservationDetails(id: string) {
    const to = `/members/my-reservations/${id}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToAllReservations() {
    const to = `/members/all-reservations`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToAllReservationDetails(id: string) {
    const to = `/members/all-reservations/${id}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToMyDiets(reservationId: string) {
    const to = `/members/my-reservations/${reservationId}/my-diets`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToAddDiet(reservationId: string) {
    const to = `/members/my-reservations/${reservationId}/my-diets/add-diet`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToAddPayment(reservationId: string) {
    const to = `/members/my-reservations/${reservationId}/my-diets/add-payment`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToEditPayment(reservationId: string, dietId: string) {
    const to = `/members/my-reservations/${reservationId}/my-diets/edit-payment/${dietId}`;
    return this.router.navigateByUrl(to, this.extras);
  }

  async goToMaintenance() {
    const to = `/members/maintenance`;
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

  async goToLogin() {
    const to = `/login`;
    this.router.navigateByUrl(to, this.extras);
  }
}
