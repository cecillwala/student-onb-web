import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPersonal } from './step-personal';

describe('StepPersonal', () => {
  let component: StepPersonal;
  let fixture: ComponentFixture<StepPersonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPersonal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPersonal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
