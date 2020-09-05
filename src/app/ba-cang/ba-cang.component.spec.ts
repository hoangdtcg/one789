import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaCangComponent } from './ba-cang.component';

describe('BaCangComponent', () => {
  let component: BaCangComponent;
  let fixture: ComponentFixture<BaCangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaCangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaCangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
