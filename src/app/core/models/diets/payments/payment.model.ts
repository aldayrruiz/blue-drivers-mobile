import { CreateDietPhoto } from '../photos/photo.model';
import { DietType } from '../type.model';

export interface Payment {
  id: string;
  diet: string;
  type: DietType;
  liters: number;
  amount: number;
  description: string;
  photos: CreateDietPhoto[];
}
