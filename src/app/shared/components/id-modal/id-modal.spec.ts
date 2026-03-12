import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdModal } from './id-modal';

describe('IdModal', () => {
  let component: IdModal;
  let fixture: ComponentFixture<IdModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
