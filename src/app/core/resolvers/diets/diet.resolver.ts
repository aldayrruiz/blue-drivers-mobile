import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CreateDiet } from 'src/app/core/models';
import { ReservationService } from '../../services';
import { DietService } from '../../services/api/diet.service';

@Injectable({
  providedIn: 'root',
})
export class DietResolver implements Resolve<CreateDiet> {
  constructor(private reservationService: ReservationService, private dietService: DietService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<CreateDiet> {
    const reservationId = route.params.reservationId;
    try {
      return await this.dietService.getDiet(reservationId).toPromise();
    } catch (error) {
      return await this.createCollection(reservationId);
    }
  }

  private async createCollection(reservationId: string): Promise<CreateDiet> {
    const reservation = await this.reservationService.get(reservationId).toPromise();
    const start = new Date(reservation.start);
    const end = new Date(reservation.end);
    const newCollection: CreateDiet = {
      reservation: reservationId,
      start: start.toJSON(),
      end: end.toJSON(),
    };
    const collection = await this.dietService.createDiet(newCollection).toPromise();
    return collection;
  }
}
