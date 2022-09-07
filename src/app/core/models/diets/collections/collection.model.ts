import { Diet } from '../diets/diet.model';

export interface DietCollection {
  id?: string;
  reservation: string;
  completed: boolean;
  start: string;
  end: string;
  diets: Diet[];
  modified?: boolean;
}
