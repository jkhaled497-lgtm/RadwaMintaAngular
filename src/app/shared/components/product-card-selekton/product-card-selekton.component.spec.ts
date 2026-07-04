import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardSelektonComponent } from './product-card-selekton.component';

describe('ProductCardSelektonComponent', () => {
  let component: ProductCardSelektonComponent;
  let fixture: ComponentFixture<ProductCardSelektonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardSelektonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardSelektonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
