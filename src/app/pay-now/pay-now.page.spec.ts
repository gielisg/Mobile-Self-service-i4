import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayNowPage } from './pay-now.page';

describe('PayNowPage', () => {
  let component: PayNowPage;
  let fixture: ComponentFixture<PayNowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayNowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayNowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
