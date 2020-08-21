import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XienComponent } from './xien.component';

describe('XienComponent', () => {
  let component: XienComponent;
  let fixture: ComponentFixture<XienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
