import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { AppRouter, StorageService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
  constructor(private storage: StorageService, private appRouter: AppRouter) {}

  async canLoad() {
    const user = await this.storage.getUser();
    if (user) {
      // If user is logged in allow loading
      return true;
    } else {
      // If user is not logged in, redirect to login page
      await this.appRouter.goToLogin();
      await this.storage.clearOnlyAuthRelated();
      return false;
    }
  }
}
