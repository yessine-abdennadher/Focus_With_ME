import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilWelocomeComponent } from './profil-welocome.component';

describe('ProfilWelocomeComponent', () => {
  let component: ProfilWelocomeComponent;
  let fixture: ComponentFixture<ProfilWelocomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilWelocomeComponent]
    });
    fixture = TestBed.createComponent(ProfilWelocomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
