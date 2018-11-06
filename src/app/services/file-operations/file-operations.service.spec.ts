import { TestBed, inject } from '@angular/core/testing';

import { FileOperationsService } from './file-operations.service';

describe('FileOperationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileOperationsService]
    });
  });

  it('should be created', inject([FileOperationsService], (service: FileOperationsService) => {
    expect(service).toBeTruthy();
  }));
});
