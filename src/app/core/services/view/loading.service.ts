import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement;
  private isLoading = false;

  constructor(private loadingCtrl: LoadingController) {}

  async present(): Promise<void> {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();
  }

  async dismiss(): Promise<void> {
    if (!this.isLoading || !this.loading) {
      return;
    }
    this.isLoading = false;
    await this.loading.dismiss();
  }
}
