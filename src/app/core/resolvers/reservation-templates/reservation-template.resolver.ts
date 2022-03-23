import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservationTemplate } from '../../models';
import { ReservationTemplateService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class ReservationTemplateResolver implements Resolve<ReservationTemplate> {
  constructor(private reservationTemplateSrv: ReservationTemplateService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ReservationTemplate> {
    const id = route.params.reservationTemplateId;
    return this.reservationTemplateSrv.get(id);
  }
}
