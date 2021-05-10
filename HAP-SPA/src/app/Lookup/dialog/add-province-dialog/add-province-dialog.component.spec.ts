import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProvinceDialogComponent } from './add-province-dialog.component';

describe('AddProvinceDialogComponent', () => {
  let component: AddProvinceDialogComponent;
  let fixture: ComponentFixture<AddProvinceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProvinceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProvinceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
