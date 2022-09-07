import { CreateDietPhoto } from '../photos/photo.model';
import { DietType } from '../type.model';

export interface Diet {
  id: string;
  collection: string;
  type: DietType;
  liters: number;
  amount: number;
  description: string;
  photos: CreateDietPhoto[];
}
