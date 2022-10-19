import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MobileUpdater {
  // constructor(private mobileService: MobileService, private alertController: AlertController) {}
  // update() {
  //   this.mobileService.latestVersion().subscribe({
  //     next: async (response: any) => {
  //       if (response.version > Number(environment.version)) {
  //         this.showNewVersionAvailable();
  //       }
  //     },
  //   });
  // }
  // private async showNewVersionAvailable() {
  //   const button = {
  //     text: 'Actualizar',
  //     role: 'confirm',
  //     handler: async () => {
  //     },
  //   };
  //   const alert = await this.alertController.create({
  //     header: 'Nueva version disponible',
  //     message: 'Pulsa en actualizar para descargar la nueva version',
  //     buttons: [button],
  //   });
  //   await alert.present();
  // }
}
