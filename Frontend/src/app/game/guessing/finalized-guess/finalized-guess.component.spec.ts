import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizedGuessComponent } from './finalized-guess.component';

describe('FinalizedGuessComponent', () => {
  let component: FinalizedGuessComponent;
  let fixture: ComponentFixture<FinalizedGuessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizedGuessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizedGuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
