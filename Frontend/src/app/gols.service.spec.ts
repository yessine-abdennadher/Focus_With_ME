import { TestBed } from '@angular/core/testing';

import { GolsService } from '../Services/gols.service';

describe('GolsService', () => {
  let service: GolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
