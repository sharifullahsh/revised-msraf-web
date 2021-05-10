import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProvinceDialogComponent } from './edit-province-dialog.component';

describe('EditProvinceDialogComponent', () => {
  let component: EditProvinceDialogComponent;
  let fixture: ComponentFixture<EditProvinceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProvinceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProvinceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
