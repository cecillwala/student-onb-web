import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepHealth } from './step-health';

describe('StepHealth', () => {
  let component: StepHealth;
  let fixture: ComponentFixture<StepHealth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepHealth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepHealth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
