import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNewsModalComponent } from './update-news-modal.component';

describe('UpdateNewsModalComponent', () => {
  let component: UpdateNewsModalComponent;
  let fixture: ComponentFixture<UpdateNewsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateNewsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateNewsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
