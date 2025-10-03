import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyStatsComponent } from './study-stats.component';

describe('StudyStatsComponent', () => {
  let component: StudyStatsComponent;
  let fixture: ComponentFixture<StudyStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyStatsComponent]
    });
    fixture = TestBed.createComponent(StudyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
