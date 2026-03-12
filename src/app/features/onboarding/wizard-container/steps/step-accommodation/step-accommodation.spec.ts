import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAccommodation } from './step-accommodation';

describe('StepAccommodation', () => {
  let component: StepAccommodation;
  let fixture: ComponentFixture<StepAccommodation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAccommodation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAccommodation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
