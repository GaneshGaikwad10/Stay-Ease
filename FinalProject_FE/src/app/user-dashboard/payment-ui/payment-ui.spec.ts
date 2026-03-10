import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUi } from './payment-ui';

describe('PaymentUi', () => {
  let component: PaymentUi;
  let fixture: ComponentFixture<PaymentUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
