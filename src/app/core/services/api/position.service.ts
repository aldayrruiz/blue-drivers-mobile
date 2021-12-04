import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/api-paths.enum';
import { environment } from 'src/environments/environment';
import { Position } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private positionUrl = `${environment.fleetBaseUrl}${ApiPaths.position}`;

  constructor(private http: HttpClient) {}

  /**
   *
   * @returns
   */
  getAll(): Observable<Position[]> {
    const path = `${this.positionUrl}/`;
    return this.http.get<Position[]>(path);
  }
}
