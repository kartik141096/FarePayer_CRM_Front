import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryListingComponent } from './itinerary-listing.component';

describe('ItineraryListingComponent', () => {
  let component: ItineraryListingComponent;
  let fixture: ComponentFixture<ItineraryListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
