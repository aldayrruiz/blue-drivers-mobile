import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { AppRouter, StorageService } from '../services';

@Injectable({ providedIn: 'root' })
export class AutoLoginGuard implements CanLoad {
  constructor(private storage: StorageService, private appRouter: AppRouter) {}

  async canLoad(): Promise<boolean> {
    const user = await this.storage.getUser();
    if (user) {
      // If user is logged in, redirect to home
      await this.appRouter.goToHome();
      return false;
    } else {
      // If user is not logged in, allow loading login page
      return true;
    }
  }
}
