import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSondageComponent } from './dashboard-sondage';

describe('DashboardSondage', () => {
  let component: DashboardSondageComponent;
  let fixture: ComponentFixture<DashboardSondageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSondageComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSondageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
