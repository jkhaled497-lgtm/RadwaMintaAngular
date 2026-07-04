import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCounterComponent } from './hero-counter.component';

describe('HeroCounterComponent', () => {
  let component: HeroCounterComponent;
  let fixture: ComponentFixture<HeroCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
