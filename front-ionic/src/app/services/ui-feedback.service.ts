import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/lazy';

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async showAlert(header: string, message: string, buttonText: string = 'Aceptar'): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [buttonText],
      cssClass: 'custom-ionic-alert'
    });
    await alert.present();
  }

  async showConfirm(
    header: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header,
        message,
        backdropDismiss: false,
        cssClass: 'custom-ionic-alert',
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: confirmText,
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'success',
    duration: number = 3000
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom',
      cssClass: 'custom-ionic-toast'
    });
    await toast.present();
  }
}
