import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStudystatsComponent } from './modal-studystats.component';

describe('ModalStudystatsComponent', () => {
  let component: ModalStudystatsComponent;
  let fixture: ComponentFixture<ModalStudystatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalStudystatsComponent]
    });
    fixture = TestBed.createComponent(ModalStudystatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
