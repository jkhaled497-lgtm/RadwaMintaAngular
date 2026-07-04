import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangChangeComponent } from './lang-change.component';

describe('LangChangeComponent', () => {
  let component: LangChangeComponent;
  let fixture: ComponentFixture<LangChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
