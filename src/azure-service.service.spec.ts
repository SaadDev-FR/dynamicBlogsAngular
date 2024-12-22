import { TestBed } from '@angular/core/testing';

import { AzureServiceService } from './azure-service.service';

describe('AzureServiceService', () => {
  let service: AzureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
