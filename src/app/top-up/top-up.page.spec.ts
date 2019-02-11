import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUpPage } from './top-up.page';

describe('TopUpPage', () => {
  let component: TopUpPage;
  let fixture: ComponentFixture<TopUpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopUpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
