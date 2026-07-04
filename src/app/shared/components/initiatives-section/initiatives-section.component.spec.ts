import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativesSectionComponent } from './initiatives-section.component';

describe('InitiativesSectionComponent', () => {
  let component: InitiativesSectionComponent;
  let fixture: ComponentFixture<InitiativesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiativesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiativesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
