import { Validators } from '@angular/forms';
import { DESC_LEN, TITLE_LEN } from './fields-config';

const required = Validators.required;
const maxLength = (length: number) => Validators.maxLength(length);

export const titleValidators = ['', [required, maxLength(TITLE_LEN)]];
export const descriptionValidators = ['', [required, maxLength(DESC_LEN)]];
export const isRecurrentValidators = [false, [required]];
export const weekdaysValidators = [[], []];
