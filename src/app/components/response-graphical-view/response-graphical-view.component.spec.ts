import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseGraphicalViewComponent } from './response-graphical-view.component';

describe('ResponseGraphicalViewComponent', () => {
  let component: ResponseGraphicalViewComponent;
  let fixture: ComponentFixture<ResponseGraphicalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseGraphicalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseGraphicalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
