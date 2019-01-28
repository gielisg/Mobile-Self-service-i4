import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyServicePage } from './my-service.page';

describe('MyServicePage', () => {
  let component: MyServicePage;
  let fixture: ComponentFixture<MyServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
