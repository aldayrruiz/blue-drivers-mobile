import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tenant } from '../../models';
import { API } from '../../utils/api-paths.enum';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private baseUrl = `${environment.fleetBaseUrl}${API.tenants}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tenant[]> {
    const path = `${this.baseUrl}/`;
    return this.http.get<Tenant[]>(path);
  }

  get(id: string): Observable<Tenant> {
    const path = `${this.baseUrl}/${id}/`;
    return this.http.get<Tenant>(path);
  }

  /**
   * Change user tenant.
   *
   * @param id tenant who will be assigned to user
   * @returns
   */
  changeTenant(id: string) {
    const path = `${this.baseUrl}/${id}/change_user_tenant/`;
    return this.http.put<Tenant>(path, {});
  }
}
