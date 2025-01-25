import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersPriceComponent } from './transfers-price.component';

describe('TransfersPriceComponent', () => {
  let component: TransfersPriceComponent;
  let fixture: ComponentFixture<TransfersPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
