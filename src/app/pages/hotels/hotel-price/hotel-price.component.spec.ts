import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPriceComponent } from './hotel-price.component';

describe('HotelPriceComponent', () => {
  let component: HotelPriceComponent;
  let fixture: ComponentFixture<HotelPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
