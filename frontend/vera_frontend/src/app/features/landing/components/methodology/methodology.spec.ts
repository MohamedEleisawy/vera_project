import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Methodology } from './methodology';

describe('Methodology', () => {
  let component: Methodology;
  let fixture: ComponentFixture<Methodology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Methodology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Methodology);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
