import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CreateRecurrentReservationPage } from './create-recurrent-reservation.page';

describe('CreateRecurrentReservationPage', () => {
  let component: CreateRecurrentReservationPage;
  let fixture: ComponentFixture<CreateRecurrentReservationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRecurrentReservationPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRecurrentReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
