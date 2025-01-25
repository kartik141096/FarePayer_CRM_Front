import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersListingComponent } from './transfers-listing.component';

describe('TransfersListingComponent', () => {
  let component: TransfersListingComponent;
  let fixture: ComponentFixture<TransfersListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
