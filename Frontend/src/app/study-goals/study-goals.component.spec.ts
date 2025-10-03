import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGoalsComponent } from './study-goals.component';

describe('StudyGoalsComponent', () => {
  let component: StudyGoalsComponent;
  let fixture: ComponentFixture<StudyGoalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyGoalsComponent]
    });
    fixture = TestBed.createComponent(StudyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
