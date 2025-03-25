import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesTableComponent } from './times-table.component';

describe('TimesTableComponent', () => {
  let component: TimesTableComponent;
  let fixture: ComponentFixture<TimesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
