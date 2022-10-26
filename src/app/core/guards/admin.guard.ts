import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Role } from '../models';
import { AppRouter, StorageService } from '../services';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanLoad {
  constructor(private storage: StorageService, private appRouter: AppRouter) {}

  async canLoad() {
    const user = await this.storage.getUser();
    if (user.role !== Role.USER) {
      // If user is admin or super admin, allow loading
      return true;
    } else {
      // If user is not logged in, redirect to login page
      await this.appRouter.goToHome();
      return false;
    }
  }
}
