import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/api-paths.enum';
import { CreateUser } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(newUser: CreateUser, serverUrl: string): Observable<CreateUser> {
    serverUrl = serverUrl.trim();
    const path = `${serverUrl}${ApiPaths.register}/`;
    return this.http.post<CreateUser>(path, newUser);
  }
}
