import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationLoggedComponent } from './navigation-logged.component';

describe('NavigationLoggedComponent', () => {
  let component: NavigationLoggedComponent;
  let fixture: ComponentFixture<NavigationLoggedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationLoggedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationLoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
