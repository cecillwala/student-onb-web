import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSelectMultiple } from './dropdown-select-multiple';

describe('DropdownSelectMultiple', () => {
  let component: DropdownSelectMultiple;
  let fixture: ComponentFixture<DropdownSelectMultiple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSelectMultiple]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSelectMultiple);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
