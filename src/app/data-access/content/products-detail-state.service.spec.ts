import { TestBed } from '@angular/core/testing';

import { ProductsDetailStateService } from './products-detail-state.service';

describe('ProductsDetailStateService', () => {
  let service: ProductsDetailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsDetailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
