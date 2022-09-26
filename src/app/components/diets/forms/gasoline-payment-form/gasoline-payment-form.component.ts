import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gasoline-payment-form',
  templateUrl: './gasoline-payment-form.component.html',
  styleUrls: ['./gasoline-payment-form.component.scss'],
})
export class GasolinePaymentFormComponent implements OnInit {
  @Input() initLiters: number;
  @Input() initAmount: number;
  @Input() initDescription = '';

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  get liters(): AbstractControl {
    return this.form.get('liters');
  }

  get amount(): AbstractControl {
    return this.form.get('amount');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  private initFormGroup() {
    this.form = this.fb.group({
      liters: [this.initLiters, [Validators.required, Validators.min(0.1)]],
      amount: [this.initAmount, [Validators.required, Validators.min(0.1)]],
      description: [this.initDescription, []],
    });
  }
}
