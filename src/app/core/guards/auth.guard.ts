import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LoginService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private loginService: LoginService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.loginService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        console.log('GUARD: ', isAuthenticated);
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }
}
