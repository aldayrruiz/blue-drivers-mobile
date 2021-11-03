import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '.';
import { User } from '../models';
import { EditUser } from '../models/edit/edit.user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  get(id: string): Observable<User> {
    const userUrl = this.urlSrv.getUsers();
    const path = `${userUrl}/${id}/`;
    return this.http.get<User>(path);
  }

  update(id: string, data: EditUser): Observable<EditUser> {
    const userUrl = this.urlSrv.getUsers();
    const path = `${userUrl}/${id}/`;
    return this.http.put<EditUser>(path, data);
  }
}
