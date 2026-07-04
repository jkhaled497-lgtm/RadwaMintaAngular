import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductsService } from '../../../core/services/products/products.service';
import { Iproduct } from '../../interfaces/iproduct';
import { ProductCardSelektonComponent } from "../product-card-selekton/product-card-selekton.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-related-products',
  imports: [ProductCardComponent, ProductCardSelektonComponent,TranslateModule],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss'
})
export class RelatedProductsComponent implements OnChanges {
  isLoading:boolean = true;
  products:Iproduct[] =[];
  @Input() categoryId:any;
  @Input() productId:any;
  private readonly productsService = inject(ProductsService);
  ngOnChanges() {
    this.getProductsByCategory();
  }
  getProductsByCategory():void{
    this.productsService.getFeaturedProductsByCategory(this.categoryId,this.productId).subscribe({
      next:(res)=>{
        this.products = res;
        this.isLoading = false;        
      }
    })
  }
}
