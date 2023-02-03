import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cleaning-form',
  templateUrl: './cleaning-form.component.html',
  styleUrls: ['./cleaning-form.component.scss'],
})
export class CleaningFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  get type(): AbstractControl {
    return this.form.get('type');
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  getData() {
    const type = this.type.value;
    return { type };
  }

  getErrors() {
    const errors = [];
    if (this.type.hasError('required')) {
      errors.push('El tipo es requerido');
    }
    return errors;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      type: [null, [Validators.required]],
    });
  }
}
