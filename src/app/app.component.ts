import { Component, OnInit } from '@angular/core';
import { AppUpdate, AppUpdateInfo } from '@capawesome/capacitor-app-update';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private alertController: AlertController) {}

  ngOnInit() {
    if (!this.platform.is('capacitor')) {
      return;
    }
    AppUpdate.getAppUpdateInfo().then((info: AppUpdateInfo) => {
      const { currentVersion, availableVersion } = info;
      if (Number(currentVersion) < Number(availableVersion)) {
        this.showNewVersionAvailable();
      }
    });
  }

  private async showNewVersionAvailable() {
    const button = {
      text: 'Actualizar',
      role: 'confirm',
      handler: async () => {
        await this.openAppStore();
      },
    };

    const alert = await this.alertController.create({
      header: 'Nueva version disponible',
      message: 'Pulsa en actualizar para descargar la nueva version',
      buttons: [button],
    });
    await alert.present();
  }

  private async openAppStore(): Promise<void> {
    await AppUpdate.openAppStore();
  }
}
