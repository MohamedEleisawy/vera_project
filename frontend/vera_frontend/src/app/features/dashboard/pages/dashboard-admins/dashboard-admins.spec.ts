import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminsComponent } from './dashboard-admins.component';

describe('DashboardAdmins', () => {
  let component: DashboardAdminsComponent;
  let fixture: ComponentFixture<DashboardAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdminsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
