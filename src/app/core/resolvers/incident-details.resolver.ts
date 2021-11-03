import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Incident } from 'src/app/core/models';
import { IncidentService } from 'src/app/core/services';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class IncidentDetailsResolver implements Resolve<Incident> {
  constructor(
    private service: IncidentService,
    private loadingSrv: LoadingService
  ) {}
  async resolve(route: ActivatedRouteSnapshot): Promise<Incident> {
    await this.loadingSrv.present();
    const id = route.params.incidentId;
    return this.service
      .get(id)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
