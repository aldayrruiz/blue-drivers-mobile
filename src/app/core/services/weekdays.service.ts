import { Injectable } from '@angular/core';

export interface WeekdayCheckbox {
  value: number;
  label: string;
  isChecked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WeekdaysService {
  getCheckboxes(): WeekdayCheckbox[] {
    const weekdays: WeekdayCheckbox[] = [];
    for (let index = 0; index < 7; index++) {
      weekdays.push(this.generateWeekDay(index));
    }
    return weekdays;
  }

  getValuesFromCheckBoxes(checkboxes: WeekdayCheckbox[]): number[] {
    return checkboxes.filter((cb) => cb.isChecked).map((cb) => cb.value);
  }

  getWeekDayLabel(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Lunes';
      case 1:
        return 'Martes';
      case 2:
        return 'Miercoles';
      case 3:
        return 'Jueves';
      case 4:
        return 'Viernes';
      case 5:
        return 'Sábado';
      case 6:
        return 'Domingo';
      default:
        return 'Error';
    }
  }

  private generateWeekDay(weekday: number) {
    return {
      value: weekday,
      label: this.getWeekDayLabel(weekday),
      isChecked: false,
    };
  }
}
