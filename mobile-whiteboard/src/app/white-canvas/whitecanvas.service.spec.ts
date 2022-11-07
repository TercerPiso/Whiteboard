import { TestBed } from '@angular/core/testing';

import { WhitecanvasService } from './whitecanvas.service';

describe('WhitecanvasService', () => {
  let service: WhitecanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhitecanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
