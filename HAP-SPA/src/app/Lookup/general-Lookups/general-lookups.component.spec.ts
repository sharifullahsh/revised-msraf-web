import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLookupsComponent } from './general-lookups.component';

describe('GeneralLookupsComponent', () => {
  let component: GeneralLookupsComponent;
  let fixture: ComponentFixture<GeneralLookupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLookupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
