import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBundlePage } from './service-bundle.page';

describe('ServiceBundlePage', () => {
  let component: ServiceBundlePage;
  let fixture: ComponentFixture<ServiceBundlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBundlePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBundlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
