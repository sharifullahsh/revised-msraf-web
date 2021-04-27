import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLookupDialogComponent } from './edit-lookup-dialog.component';

describe('EditLookupDialogComponent', () => {
  let component: EditLookupDialogComponent;
  let fixture: ComponentFixture<EditLookupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLookupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLookupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
