import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Incident } from '../../models';
import { IncidentService, LoadingService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class IncidentDetailsResolver implements Resolve<Incident> {
  constructor(
    private readonly incidentService: IncidentService,
    private readonly loadingSrv: LoadingService
  ) {}
  async resolve(route: ActivatedRouteSnapshot): Promise<Incident> {
    await this.loadingSrv.present();
    const id = route.params.incidentId;
    return this.incidentService
      .get(id)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
