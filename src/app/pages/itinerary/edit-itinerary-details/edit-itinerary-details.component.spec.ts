import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItineraryDetailsComponent } from './edit-itinerary-details.component';

describe('EditItineraryDetailsComponent', () => {
  let component: EditItineraryDetailsComponent;
  let fixture: ComponentFixture<EditItineraryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditItineraryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditItineraryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
