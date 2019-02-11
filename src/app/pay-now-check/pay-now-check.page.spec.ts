import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayNowCheckPage } from './pay-now-check.page';

describe('PayNowCheckPage', () => {
  let component: PayNowCheckPage;
  let fixture: ComponentFixture<PayNowCheckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayNowCheckPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayNowCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
