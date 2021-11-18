import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { toastConfig } from '../../shared/utils/toast-config';

@Injectable({
  providedIn: 'root',
})
export class SnackerService {
  constructor(private toastCtrl: ToastController) {}

  createSuccessful(message: string): Promise<HTMLIonToastElement> {
    return this.toastCtrl.create({
      color: toastConfig.successColor,
      message,
      duration: toastConfig.time,
    });
  }

  createFailed(message: string): Promise<HTMLIonToastElement> {
    return this.toastCtrl.create({
      color: toastConfig.errorColor,
      message,
      duration: toastConfig.time,
    });
  }
}
