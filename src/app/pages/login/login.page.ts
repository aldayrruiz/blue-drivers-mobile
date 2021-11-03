import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import {
  ErrorMessageService,
  Key,
  LoadingService,
  LoginService,
  StorageService,
} from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  submitted = false;
  availableServers = environment.servers;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private alertController: AlertController,
    private router: Router,
    private loadingSrv: LoadingService,
    private errorMessage: ErrorMessageService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  async login(): Promise<void> {
    await this.loadingSrv.present();

    const status = await Network.getStatus();

    if (!status.connected) {
      await this.loadingSrv.dismiss();
      const alert = await this.alertController.create({
        header: 'Login failed',
        message: 'No tienes conexión a internet.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    const credentials = this.getCredentials();

    this.loginService
      .login(credentials)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          this.router.navigateByUrl('/members', { replaceUrl: true });
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          const alert = await this.alertController.create({
            header: 'Login failed',
            message,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
  }

  goToRegisterPage() {
    this.router.navigateByUrl(`register`);
  }

  get username(): AbstractControl {
    return this.credentials.get('username');
  }

  get password(): AbstractControl {
    return this.credentials.get('password');
  }

  // get serverText(): AbstractControl {
  //   return this.credentials.get('serverText');
  // }

  get serverSelect(): AbstractControl {
    return this.credentials.get('serverSelect');
  }

  private async loadServerUrl(): Promise<void> {
    const serverUrl = await this.storage.getP(Key.serverUrl);
    this.credentials.setValue({
      username: '',
      password: '',
      serverSelect: serverUrl,
    });
  }

  private initFormGroup() {
    const urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    const prodValidators = [Validators.required, Validators.pattern(urlReg)];
    const devValidators = [Validators.required];
    const urlValidators = environment.production
      ? prodValidators
      : devValidators;

    this.credentials = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // serverText: ['', urlValidators],
      serverSelect: ['', urlValidators],
    });

    this.loadServerUrl();
  }

  private getCredentials() {
    return {
      username: this.username.value,
      password: this.password.value,
      serverUrl: this.serverSelect.value,
    };
  }
}
