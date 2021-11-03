import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Incident } from 'src/app/core/models';
import { IncidentService } from 'src/app/core/services/incident.service';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class MyIncidentsResolver implements Resolve<Incident[]> {
  constructor(
    private service: IncidentService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(): Promise<Incident[]> {
    await this.loadingSrv.present();
    return this.service
      .getAll()
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
