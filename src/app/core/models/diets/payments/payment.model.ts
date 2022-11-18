import { CreateDietPhoto } from '../photos/photo.model';
import { PaymentType } from './type.model';

export interface Payment {
  id: string;
  diet: string;
  type: PaymentType;
  liters: number;
  amount: number;
  description: string;
  photos: CreateDietPhoto[];
  demand: boolean;
  photo?: string;
}
