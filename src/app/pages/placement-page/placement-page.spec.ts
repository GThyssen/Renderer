import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementPage } from './placement-page';

describe('PlacementPage', () => {
  let component: PlacementPage;
  let fixture: ComponentFixture<PlacementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
