import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateZonerHelper } from 'src/app/core/services';

@Component({
  selector: 'app-repairment-form',
  templateUrl: './repairment-form.component.html',
  styleUrls: ['./repairment-form.component.scss'],
})
export class RepairmentFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private zoner: DateZonerHelper) {}

  get location(): AbstractControl {
    return this.form.get('location');
  }

  get kilometers(): AbstractControl {
    return this.form.get('kilometers');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  getData() {
    const location = this.location.value;
    const kilometers: number = this.kilometers.value;
    const description = this.description.value;
    return { location, kilometers, description };
  }

  getErrors() {
    const errors = [];
    if (this.location.invalid) {
      errors.push('El lugar es requerido');
    }
    if (this.kilometers.getError('required')) {
      errors.push('Los kilómetros son requeridos');
    }
    if (this.kilometers.getError('min')) {
      errors.push('Los kilómetros deben ser mayor o igual que 0');
    }
    if (this.description.getError('required')) {
      errors.push('Los kilómetros son requeridos');
    }
    if (this.description.getError('min')) {
      errors.push('Los kilómetros deben ser mayor o igual que 0');
    }
    return errors;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      location: ['', [Validators.required, Validators.maxLength(50)]],
      kilometers: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }
}
