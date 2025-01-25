import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesListingComponent } from './activities-listing.component';

describe('ActivitiesListingComponent', () => {
  let component: ActivitiesListingComponent;
  let fixture: ComponentFixture<ActivitiesListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
