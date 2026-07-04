import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingStageSectionComponent } from './processing-stage-section.component';

describe('ProcessingStageSectionComponent', () => {
  let component: ProcessingStageSectionComponent;
  let fixture: ComponentFixture<ProcessingStageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingStageSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingStageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
