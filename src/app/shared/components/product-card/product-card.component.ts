import { Component, inject, Input } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsService } from '../../../core/services/products/products.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink,TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  private readonly productsService = inject(ProductsService);
  isLoading:boolean = false;
  @Input() product:Iproduct = {
    id: 0,
    name: '',
    pictureUrl: '',
    scientificName: '',
    forms: [],
    activeIngredients: [],
    harvestSeason: [],
    availability: '',
    containerCapacity: [],
    naturalWonders: [],
    categoryId: 0,
    categoryName: ''
  };


  orderNow():void{
    this.isLoading = true;
    this.productsService.orderNow(this.product.id).subscribe({
      next:(res)=>{
        window.location.href = res.whatsappLink;
        this.isLoading = false;
      },
      error:(err)=>{
        this.isLoading = false;
      }
    })
  }

}
