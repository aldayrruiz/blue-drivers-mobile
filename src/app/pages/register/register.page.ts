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
import { CreateUser } from 'src/app/core/models';
import {
  ErrorMessageService,
  LoadingService,
  LoginService,
  SnackerService,
} from 'src/app/core/services';
import { RegisterService } from 'src/app/core/services/register.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;
  submitted = false;
  availableServers = environment.servers;

  constructor(
    private errorMessage: ErrorMessageService,
    private alertController: AlertController,
    private registerSrv: RegisterService,
    private loadingSrv: LoadingService,
    private snacker: SnackerService,
    private loginSrv: LoginService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  async register(): Promise<void> {
    await this.loadingSrv.present();

    const validationsPassed = await this.passValidations();
    if (!validationsPassed) {
      await this.loadingSrv.dismiss();
      return;
    }

    const { email, fullname, password1, serverSelect } = this.credentials.value;

    const newUser: CreateUser = {
      email,
      fullname,
      password: password1,
    };

    this.registerSrv
      .register(newUser, serverSelect)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          await this.login(email, password1, serverSelect);
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }

  async login(
    username: string,
    password: string,
    serverUrl: string
  ): Promise<void> {
    await this.loadingSrv.present();

    this.loginSrv
      .login({ username, password, serverUrl })
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

  get email(): AbstractControl {
    return this.credentials.get('email');
  }

  get fullname(): AbstractControl {
    return this.credentials.get('fullname');
  }

  get password1(): AbstractControl {
    return this.credentials.get('password1');
  }

  get password2(): AbstractControl {
    return this.credentials.get('password2');
  }

  get serverSelect(): AbstractControl {
    return this.credentials.get('serverSelect');
  }

  private initFormGroup() {
    const urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    const prodValidators = [Validators.required, Validators.pattern(urlReg)];
    const envValidators = [Validators.required];
    const urlValidators = environment.production
      ? prodValidators
      : envValidators;

    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      password1: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      serverSelect: ['', urlValidators],
    });
  }

  private matchPasswords = (pass1: string, pass2: string) => pass1 === pass2;

  /**
   * Shows an alert if user has connection to internet
   *
   * @param title Title of alert
   * @returns Return true if user has connection to internet. Otherwise false.
   */
  private async showToastIfNotInternet(): Promise<boolean> {
    const status = await Network.getStatus();

    if (!status.connected) {
      const toast = await this.snacker.createFailed('No Internet');
      await toast.present();
      return false;
    }
    return true;
  }

  private async passValidations() {
    const hasInternet = await this.showToastIfNotInternet();
    if (!hasInternet) {
      return false;
    }

    const { password1, password2 } = this.credentials.value;
    const matchPasswords = this.matchPasswords(password1, password2);
    if (!matchPasswords) {
      const toast = await this.snacker.createFailed(
        'Las contraseñas NO son iguales'
      );
      await toast.present();
      return false;
    }

    return true;
  }
}
