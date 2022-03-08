import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Position } from '../../models';
import { PositionService } from '../../services';

@Injectable({ providedIn: 'root' })
export class PositionsResolver implements Resolve<Position[]> {
  constructor(private positionSrv: PositionService) {}

  resolve(): Observable<Position[]> {
    return this.positionSrv.getAll();
  }
}
