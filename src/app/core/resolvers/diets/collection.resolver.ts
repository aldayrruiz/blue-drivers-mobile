import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CreateDietCollection } from 'src/app/core/models';
import { ReservationService } from '../../services';
import { DietService } from '../../services/api/diet.service.service';

@Injectable({
  providedIn: 'root',
})
export class DietCollectionResolver implements Resolve<CreateDietCollection> {
  constructor(private reservationService: ReservationService, private dietService: DietService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<CreateDietCollection> {
    const reservationId = route.params.reservationId;
    try {
      return await this.dietService.getDietCollection(reservationId).toPromise();
    } catch (error) {
      return await this.createCollection(reservationId);
    }
  }

  private async createCollection(reservationId: string): Promise<CreateDietCollection> {
    const reservation = await this.reservationService.get(reservationId).toPromise();
    const start = new Date(reservation.start);
    const end = new Date(reservation.end);
    const newCollection: CreateDietCollection = {
      reservation: reservationId,
      start: start.toJSON(),
      end: end.toJSON(),
    };
    const collection = await this.dietService.createDietCollection(newCollection).toPromise();
    return collection;
  }
}
