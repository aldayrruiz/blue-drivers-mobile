import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LoginService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(private loginService: LoginService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.loginService.isAuth.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/members', { replaceUrl: true });
          // Return false, because it cannot go to login if authenticated.
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
