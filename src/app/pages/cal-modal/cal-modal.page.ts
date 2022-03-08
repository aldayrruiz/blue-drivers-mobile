import { AfterViewInit, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalModalService } from 'src/app/core/services/cal-modal.service';

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements AfterViewInit {
  delay = 100;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  viewTitle: string;

  event = {
    title: '',
    desc: '',
    date: null,
    allDay: false,
  };

  modalReady = false;

  constructor(private modalCtrl: ModalController, private calModalService: CalModalService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.modalReady = true;
      this.calendar.currentDate = this.calModalService.getDate();
    }, this.delay);
  }

  save(): void {
    this.modalCtrl.dismiss({ event: this.event });
  }

  onViewTitleChanged(title): void {
    this.viewTitle = title;
  }

  onTimeSelected(ev): void {
    this.event.date = new Date(ev.selectedTime);
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
