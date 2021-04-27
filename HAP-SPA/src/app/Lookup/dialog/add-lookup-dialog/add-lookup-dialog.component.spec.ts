import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLookupDialogComponent } from './add-lookup-dialog.component';

describe('AddLookupDialogComponent', () => {
  let component: AddLookupDialogComponent;
  let fixture: ComponentFixture<AddLookupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLookupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLookupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
