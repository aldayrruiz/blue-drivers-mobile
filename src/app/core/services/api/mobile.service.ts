import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '..';

@Injectable({ providedIn: 'root' })
export class MobileService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  latestVersion(): Observable<any> {
    const mobileUrl = this.urlSrv.getMobile();
    const path = `${mobileUrl}/latest_version/`;
    return this.http.get(path);
  }
}
