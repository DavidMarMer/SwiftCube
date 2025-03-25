import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualScrambleComponent } from './visual-scramble.component';

describe('VisualScrambleComponent', () => {
  let component: VisualScrambleComponent;
  let fixture: ComponentFixture<VisualScrambleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualScrambleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualScrambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
