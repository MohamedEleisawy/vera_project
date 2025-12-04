import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsComponent } from './dashboard-admins';

describe('DashboardAdmins', () => {
  let component: AdminsComponent;
  let fixture: ComponentFixture<AdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
