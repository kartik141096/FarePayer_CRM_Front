import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPriceComponent } from './activities-price.component';

describe('ActivitiesPriceComponent', () => {
  let component: ActivitiesPriceComponent;
  let fixture: ComponentFixture<ActivitiesPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
