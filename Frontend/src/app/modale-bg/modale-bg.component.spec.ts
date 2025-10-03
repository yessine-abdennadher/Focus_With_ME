import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleBgComponent } from './modale-bg.component';

describe('ModaleBgComponent', () => {
  let component: ModaleBgComponent;
  let fixture: ComponentFixture<ModaleBgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModaleBgComponent]
    });
    fixture = TestBed.createComponent(ModaleBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
