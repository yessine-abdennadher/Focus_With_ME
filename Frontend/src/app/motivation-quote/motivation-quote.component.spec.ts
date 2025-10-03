import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivationQuoteComponent } from './motivation-quote.component';

describe('MotivationQuoteComponent', () => {
  let component: MotivationQuoteComponent;
  let fixture: ComponentFixture<MotivationQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotivationQuoteComponent]
    });
    fixture = TestBed.createComponent(MotivationQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
