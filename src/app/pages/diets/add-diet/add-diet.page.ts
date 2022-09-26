import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eachDayOfInterval, Interval, isWithinInterval, setHours } from 'date-fns';
import { DatetimeComponent } from 'src/app/components/datetime/datetime.component';
import { Diet } from 'src/app/core/models';
import { AppRouter, DateZonerHelper, SnackerService } from 'src/app/core/services';
import { DietService } from 'src/app/core/services/api/diet.service';

@Component({
  selector: 'app-add-diet',
  templateUrl: './add-diet.page.html',
  styleUrls: ['./add-diet.page.scss'],
})
export class AddDietPage implements OnInit {
  @ViewChild('start') start: DatetimeComponent;
  @ViewChild('end') end: DatetimeComponent;
  initStart: string;
  initEnd: string;

  toolbarTitle = 'Dieta y gastos';
  diet: Diet;
  numberOfDiets = 0;

  constructor(
    private dietService: DietService,
    private snacker: SnackerService,
    private zoner: DateZonerHelper,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {}

  ngOnInit(): void {
    this.resolveData();
    this.initDates();
  }

  save() {
    const start = this.start.getDateSerialized();
    const end = this.end.getDateSerialized();
    const number_of_diets = this.numberOfDiets;

    this.dietService.patchDiet(this.diet.id, { start, end, number_of_diets }).subscribe({
      next: () => {
        this.snacker.showSuccessful('Dieta guardada');
        this.appRouter.goToMyDiets(this.diet.reservation);
      },
      error: () => this.snacker.showFailed('Error al guardar dieta'),
    });
  }

  calculateNumberOfDiets() {
    const start = new Date(this.start?.datetime || null);
    const end = new Date(this.end?.datetime || null);
    if (start > end) {
      this.numberOfDiets = 0;
      return 'La fecha de salida debe ser antes que la de llegada';
    }
    const days = eachDayOfInterval({ start, end });
    const lunchHours = { start: 14, end: 15 };
    const dinnerHours = { start: 22, end: 23 };
    const lunches = this.getIntervalsDaysByHours(days, lunchHours.start, lunchHours.end);
    const dinners = this.getIntervalsDaysByHours(days, dinnerHours.start, dinnerHours.end);
    const meals = [...lunches, ...dinners];
    let numberOfDiets = 0;
    meals.forEach((meal) => {
      if (this.isIntervalWithinInterval(meal, { start, end })) {
        numberOfDiets += 0.5;
      }
    });
    this.numberOfDiets = numberOfDiets;
    return numberOfDiets;
  }

  private getIntervalsDaysByHours(days: Date[], startHours: number, endHours: number) {
    return days.map((day) => {
      const start = setHours(day, startHours);
      const end = setHours(day, endHours);
      return { start, end };
    });
  }

  private isIntervalWithinInterval({ start, end }: Interval, interval: Interval) {
    return isWithinInterval(start, interval) && isWithinInterval(end, interval);
  }

  private initDates() {
    const start = new Date(this.diet.start);
    const end = new Date(this.diet.end);

    this.initStart = this.zoner.toMyZone(start);
    this.initEnd = this.zoner.toMyZone(end);
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.diet = response.diet;
    });
  }
}
