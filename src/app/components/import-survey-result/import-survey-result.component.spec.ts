import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSurveyResultComponent } from './import-survey-result.component';

describe('ImportSurveyResultComponent', () => {
  let component: ImportSurveyResultComponent;
  let fixture: ComponentFixture<ImportSurveyResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportSurveyResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSurveyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
