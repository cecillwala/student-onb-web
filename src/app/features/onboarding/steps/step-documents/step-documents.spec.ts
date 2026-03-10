import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDocuments } from './step-documents';

describe('StepDocuments', () => {
  let component: StepDocuments;
  let fixture: ComponentFixture<StepDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
