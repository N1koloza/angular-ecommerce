import { TestBed } from '@angular/core/testing';

import { CartSevice } from './cart-sevice';

describe('CartSevice', () => {
  let service: CartSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
