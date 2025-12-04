import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSondage } from './dashboard-sondage';

describe('DashboardSondage', () => {
  let component: DashboardSondage;
  let fixture: ComponentFixture<DashboardSondage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSondage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSondage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
