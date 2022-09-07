import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Diet } from 'src/app/core/models';
import { LoadingService } from '../../services';
import { DietService } from '../../services/api/diet.service.service';

@Injectable({
  providedIn: 'root',
})
export class DietResolver implements Resolve<Diet> {
  constructor(private dietService: DietService, private loadingSrv: LoadingService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Diet> {
    await this.loadingSrv.present();
    const dietId = route.params.dietId;
    return this.dietService
      .getDiet(dietId)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
