import { Validators } from '@angular/forms';
import { DESCRIPTION_MAX_LENGTH, PASSWORD_MIN_LENGTH, TITLE_MAX_LENGTH } from './fields-config';

// Utils
const required = Validators.required;
const maxLength = (length: number) => Validators.maxLength(length);
const minLength = (length: number) => Validators.minLength(length);
const isEmail = Validators.email;

const descriptionMaxLength = maxLength(DESCRIPTION_MAX_LENGTH);
const titleMaxLength = maxLength(TITLE_MAX_LENGTH);
const passwordMinLength = minLength(PASSWORD_MIN_LENGTH);

export const titleValidators = [required, titleMaxLength];
export const descriptionValidators = [descriptionMaxLength];
export const isRecurrentValidators = [required];
export const weekdaysValidators = [];
export const incidentTypeValidators = [required];
export const fullnameValidators = [required];
export const passwordValidators = [required, passwordMinLength];
export const emailValidators = [required, isEmail];
