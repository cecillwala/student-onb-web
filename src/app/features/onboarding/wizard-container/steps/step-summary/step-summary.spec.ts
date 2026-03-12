import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSummary } from './step-summary';

describe('StepSummary', () => {
  let component: StepSummary;
  let fixture: ComponentFixture<StepSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
