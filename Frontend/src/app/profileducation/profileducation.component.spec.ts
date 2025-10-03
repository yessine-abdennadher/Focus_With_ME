import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileducationComponent } from './profileducation.component';

describe('ProfileducationComponent', () => {
  let component: ProfileducationComponent;
  let fixture: ComponentFixture<ProfileducationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileducationComponent]
    });
    fixture = TestBed.createComponent(ProfileducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
