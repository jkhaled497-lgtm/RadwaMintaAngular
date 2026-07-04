import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutobiographySectionComponent } from './autobiography-section.component';

describe('AutobiographySectionComponent', () => {
  let component: AutobiographySectionComponent;
  let fixture: ComponentFixture<AutobiographySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutobiographySectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutobiographySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
