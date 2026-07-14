import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNewsModalComponent } from './manage-news-modal.component';

describe('ManageNewsModalComponent', () => {
  let component: ManageNewsModalComponent;
  let fixture: ComponentFixture<ManageNewsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageNewsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageNewsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
