import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Congratulations } from './congratulations';

describe('Congratulations', () => {
  let component: Congratulations;
  let fixture: ComponentFixture<Congratulations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Congratulations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Congratulations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
