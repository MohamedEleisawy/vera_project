import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdmins } from './dashboard-admins';

describe('DashboardAdmins', () => {
  let component: DashboardAdmins;
  let fixture: ComponentFixture<DashboardAdmins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdmins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdmins);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
