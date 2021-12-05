import { TestBed } from '@angular/core/testing';
import { PasswordRecover } from './password-recover.service';

describe('PasswordRecoverService', () => {
  let service: PasswordRecover;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRecover);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
