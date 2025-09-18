import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryComp } from './order-history-comp';

describe('OrderHistoryComp', () => {
  let component: OrderHistoryComp;
  let fixture: ComponentFixture<OrderHistoryComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHistoryComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHistoryComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
