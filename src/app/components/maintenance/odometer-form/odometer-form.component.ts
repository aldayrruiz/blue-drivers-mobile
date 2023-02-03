import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-odometer-form',
  templateUrl: './odometer-form.component.html',
  styleUrls: ['./odometer-form.component.scss'],
})
export class OdometerFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  get kilometers(): AbstractControl {
    return this.form.get('kilometers');
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  getData() {
    const kilometers: number = this.kilometers.value;
    return { kilometers };
  }

  getErrors() {
    const errors = [];
    if (this.kilometers.getError('required')) {
      errors.push('Los kilómetros son requeridos');
    }
    if (this.kilometers.getError('min')) {
      errors.push('Los kilómetros deben ser mayor o igual que 0');
    }
    return errors;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      kilometers: [null, [Validators.required, Validators.min(0)]],
    });
  }
}
