import { TestBed } from '@angular/core/testing';

import { ReferenceApi } from './reference-api';

describe('ReferenceApi', () => {
  let service: ReferenceApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
