import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePlanPage } from './change-plan.page';

describe('ChangePlanPage', () => {
  let component: ChangePlanPage;
  let fixture: ComponentFixture<ChangePlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePlanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
