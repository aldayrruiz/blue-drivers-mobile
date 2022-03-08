import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Incident } from '../../models';
import { IncidentService, LoadingService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class MyIncidentsResolver implements Resolve<Incident[]> {
  constructor(private service: IncidentService, private loadingSrv: LoadingService) {}

  async resolve(): Promise<Incident[]> {
    await this.loadingSrv.present();
    return this.service
      .getAll()
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
