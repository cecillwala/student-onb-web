import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepIdVerification } from './step-id-verification';

describe('StepIdVerification', () => {
  let component: StepIdVerification;
  let fixture: ComponentFixture<StepIdVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepIdVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepIdVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
