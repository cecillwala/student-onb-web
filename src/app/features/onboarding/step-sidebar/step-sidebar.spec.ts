import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSidebar } from './step-sidebar';

describe('StepSidebar', () => {
  let component: StepSidebar;
  let fixture: ComponentFixture<StepSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
