/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReminderListComponent } from './reminder-list.component';

describe('ReminderListComponent', () => {
  let component: ReminderListComponent;
  let fixture: ComponentFixture<ReminderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReminderListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
