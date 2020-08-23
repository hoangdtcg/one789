import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DitNhatComponent } from './dit-nhat.component';

describe('DitNhatComponent', () => {
  let component: DitNhatComponent;
  let fixture: ComponentFixture<DitNhatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DitNhatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DitNhatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
