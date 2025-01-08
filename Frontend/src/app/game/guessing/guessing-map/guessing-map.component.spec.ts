import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessingMapComponent } from './guessing-map.component';

describe('GuessingMapComponent', () => {
  let component: GuessingMapComponent;
  let fixture: ComponentFixture<GuessingMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessingMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
