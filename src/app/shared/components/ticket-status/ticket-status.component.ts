import { Component, Input, OnInit } from '@angular/core';
import { TicketStatus } from 'src/app/core/models';

@Component({
  selector: 'app-ticket-status',
  templateUrl: './ticket-status.component.html',
  styleUrls: ['./ticket-status.component.scss'],
})
export class TicketStatusComponent implements OnInit {
  @Input() status: TicketStatus;

  constructor() {}

  ngOnInit() {}
}
