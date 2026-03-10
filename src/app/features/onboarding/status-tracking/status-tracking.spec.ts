import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTracking } from './status-tracking';

describe('StatusTracking', () => {
  let component: StatusTracking;
  let fixture: ComponentFixture<StatusTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusTracking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
