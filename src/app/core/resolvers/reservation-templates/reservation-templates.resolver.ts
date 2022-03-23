import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservationTemplate } from 'src/app/core/models';
import { ReservationTemplateService } from '../../services';

@Injectable({ providedIn: 'root' })
export class ReservationTemplatesResolver implements Resolve<ReservationTemplate[]> {
  constructor(private reservationTemplateSrv: ReservationTemplateService) {}

  resolve(): Observable<ReservationTemplate[]> {
    return this.reservationTemplateSrv.getAll();
  }
}
