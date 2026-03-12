import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfieModal } from './selfie-modal';

describe('SelfieModal', () => {
  let component: SelfieModal;
  let fixture: ComponentFixture<SelfieModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfieModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfieModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
