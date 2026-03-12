import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAcademic } from './step-academic';

describe('StepAcademic', () => {
  let component: StepAcademic;
  let fixture: ComponentFixture<StepAcademic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAcademic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAcademic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
