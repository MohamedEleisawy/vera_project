import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confidentialite } from './confidentialite';

describe('Confidentialite', () => {
  let component: Confidentialite;
  let fixture: ComponentFixture<Confidentialite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confidentialite],
    }).compileComponents();

    fixture = TestBed.createComponent(Confidentialite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
