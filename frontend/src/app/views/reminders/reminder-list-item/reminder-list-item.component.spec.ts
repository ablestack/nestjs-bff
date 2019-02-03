/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReminderListItemComponent } from './reminder-list-item.component';

describe('ReminderListItemComponent', () => {
  let component: ReminderListItemComponent;
  let fixture: ComponentFixture<ReminderListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReminderListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
