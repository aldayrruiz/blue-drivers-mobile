import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/utils/api-paths.enum';
import { environment } from 'src/environments/environment';
import { CreateUser } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(newUser: CreateUser): Observable<CreateUser> {
    const path = `${environment.fleetBaseUrl}${ApiPaths.register}/`;
    return this.http.post<CreateUser>(path, newUser);
  }
}
