import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-common-diet-form',
  templateUrl: './common-diet-form.component.html',
  styleUrls: ['./common-diet-form.component.scss'],
})
export class CommonDietFormComponent implements OnInit {
  @Input() initAmount = '';
  @Input() initDescription = '';
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

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
      amount: [this.initAmount, [Validators.required, Validators.min(0.1)]],
      description: [this.initDescription, []],
    });
  }
}
