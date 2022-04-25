import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CreateRecoverPasswordResponse } from 'src/app/core/models/auth/create-recover-password-response.model';
import {
  AppRouter,
  ErrorMessageService,
  LoadingService,
  PasswordRecover,
  SnackerService,
} from 'src/app/core/services';
import { emailValidators } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {
  createRecoverPassword: FormGroup;
  confirmRecoverPassword: FormGroup;
  submitted = false;
  okReceived = false;
  private recoverPasswordId: string;

  constructor(
    private errorMessage: ErrorMessageService,
    private passwordRecover: PasswordRecover,
    private loadingSrv: LoadingService,
    private snacker: SnackerService,
    private fb: FormBuilder,
    private ghost: AppRouter
  ) {}

  get email(): AbstractControl {
    return this.createRecoverPassword.get('email');
  }

  get code(): AbstractControl {
    return this.confirmRecoverPassword.get('code');
  }

  ngOnInit() {
    this.initCreateRecoverPasswordForm();
    this.initConfirmRecoverPasswordForm();
  }

  async sendEmailToRecoverPassword() {
    await this.loadingSrv.present();
    this.submitted = true;
    const email = this.email.value;
    this.passwordRecover
      .recover(email)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response: CreateRecoverPasswordResponse) => {
          this.recoverPasswordId = response.id;
          this.okReceived = true;
          const msg = 'Se le ha enviado un código a su correo';
          await this.snacker.showSuccessful(msg);
        },
        async (error) => {
          const msg = this.errorMessage.get(error);
          await this.snacker.showFailed(msg);
        }
      );
  }

  confirmCodeByEmail() {
    const code = this.code.value;
    this.passwordRecover.confirm(this.recoverPasswordId, code).subscribe(
      async () => {
        const msg = 'Se le ha enviado una nueva contraseña por correo';
        await this.snacker.showSuccessful(msg);
        await this.ghost.goToLogin();
      },
      async () => {
        const msg = 'Código incorrecto, pruebe otra vez.';
        await this.snacker.showFailed(msg);
      }
    );
  }

  private initCreateRecoverPasswordForm() {
    this.createRecoverPassword = this.fb.group({
      email: ['', emailValidators],
    });
  }

  private initConfirmRecoverPasswordForm() {
    this.confirmRecoverPassword = this.fb.group({
      code: ['', [Validators.required]],
    });
  }
}
