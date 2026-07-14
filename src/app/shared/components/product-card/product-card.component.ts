import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink,TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit {
  ngOnInit(): void {
    this.environmentImageUrl  = environment.FilesURL;
    if (typeof window !== 'undefined' && window.localStorage) {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('token');
      this.isAdmin = !!token && userType?.trim().toLowerCase() === 'admin';
    }
  }
  isAdmin: boolean = false;
  get currentLang(): string {
    return typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en';
  }
  @Output() edit = new EventEmitter<Iproduct>();
  @Output() delete = new EventEmitter<Iproduct>();
  private readonly productsService = inject(ProductsService);
  isLoading:boolean = false;
  @Input() product:Iproduct = {
    id: 0,
    name: '',
    nameAr: '',
    pictureUrl: '',
    scientificName: '',
    scientificNameAr: '',
    forms: [],
    formsAr: [],
    activeIngredients: [],
    activeIngredientsAr: [],
    harvestSeason: [],
    harvestSeasonAr: [],
    availability: '',
    availabilityAr: '',
    containerCapacity: [],
    containerCapacityAr: [],
    naturalWonders: [],
    naturalWondersAr: [],
    categoryId: 0,
    categoryName: ''
  };
environmentImageUrl: any;


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

  onEdit(event: Event): void {
    event.stopPropagation();
    if (this.isAdmin) {
      this.edit.emit(this.product);
    }
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (this.isAdmin) {
      this.delete.emit(this.product);
    }
  }

}
