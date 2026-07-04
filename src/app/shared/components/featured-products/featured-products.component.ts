import { Component, inject } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductCardSelektonComponent } from "../product-card-selekton/product-card-selekton.component";
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products/products.service';
import { Iproduct } from '../../interfaces/iproduct';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-products',
  imports: [ProductCardComponent, ProductCardSelektonComponent,RouterLink,TranslateModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent {
  isLoading:boolean = false;
  private readonly productsService = inject(ProductsService);
  featuredProducts:Iproduct[] = [];
  ngOnInit(): void {
    this.getFeaturedProducts();
  }
  getFeaturedProducts():void{
    this.isLoading = true;
    this.productsService.getFeaturedProducts().subscribe({
      next:(res)=>{
        this.featuredProducts = res;
        this.isLoading = false;
      }
    })
  }
}
