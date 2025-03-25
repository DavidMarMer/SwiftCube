import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateCubesComponent } from './administrate-cubes.component';

describe('AdministrateCubesComponent', () => {
  let component: AdministrateCubesComponent;
  let fixture: ComponentFixture<AdministrateCubesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrateCubesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrateCubesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
