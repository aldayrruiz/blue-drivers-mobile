import { Payment } from '../payments/payment.model';

export interface Diet {
  id?: string;
  reservation: string;
  completed: boolean;
  start: string;
  end: string;
  payments: Payment[];
  modified?: boolean;
}
