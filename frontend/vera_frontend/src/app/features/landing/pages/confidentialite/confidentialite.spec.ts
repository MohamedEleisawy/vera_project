import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<<< HEAD:frontend/vera_frontend/src/app/features/dashboard/components/sidebar/sidebar.spec.ts
import { Sidebar } from './sidebar.component';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
========

import { Confidentialite } from './confidentialite';

describe('Confidentialite', () => {
  let component: Confidentialite;
  let fixture: ComponentFixture<Confidentialite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confidentialite],
    }).compileComponents();

    fixture = TestBed.createComponent(Confidentialite);
>>>>>>>> b39c2ffa90710d37494a838fd6548463299f74b7:frontend/vera_frontend/src/app/features/landing/pages/confidentialite/confidentialite.spec.ts
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
