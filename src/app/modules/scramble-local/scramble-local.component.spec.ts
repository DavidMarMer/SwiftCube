import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrambleLocalComponent } from './scramble-local.component';

describe('ScrambleLocalComponent', () => {
  let component: ScrambleLocalComponent;
  let fixture: ComponentFixture<ScrambleLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrambleLocalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrambleLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
