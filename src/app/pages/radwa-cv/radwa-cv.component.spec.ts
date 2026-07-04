import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadwaCVComponent } from './radwa-cv.component';

describe('RadwaCVComponent', () => {
  let component: RadwaCVComponent;
  let fixture: ComponentFixture<RadwaCVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadwaCVComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadwaCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
