import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { RelatedProductsComponent } from "../../shared/components/related-products/related-products.component";
import { TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-product-details',
  imports: [RelatedProductsComponent, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  product: Iproduct = {
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
  get currentLang(): string {
    return typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en';
  }
  
  get displayName(): string { return this.currentLang === 'ar' ? (this.product.nameAr || this.product.name || '') : (this.product.name || ''); }
  get displayScientificName(): string { return this.currentLang === 'ar' ? (this.product.scientificNameAr || this.product.scientificName || '') : (this.product.scientificName || ''); }
  get displayCategoryName(): string { return this.currentLang === 'ar' ? (this.product.category?.nameAr || this.product.category?.name || this.product.categoryName || '') : (this.product.category?.name || this.product.categoryName || ''); }
  get displayActiveIngredients(): string[] { return this.currentLang === 'ar' && this.product.activeIngredientsAr?.length ? this.product.activeIngredientsAr : (this.product.activeIngredients || []); }
  get displayHarvestSeason(): string[] { return this.currentLang === 'ar' && this.product.harvestSeasonAr?.length ? this.product.harvestSeasonAr : (this.product.harvestSeason || []); }
  get displayAvailability(): any { return this.currentLang === 'ar' && this.product.availabilityAr?.length ? this.product.availabilityAr : (this.product.availability || []); }
  get displayNaturalWonders(): string[] { return this.currentLang === 'ar' && this.product.naturalWondersAr?.length ? this.product.naturalWondersAr : (this.product.naturalWonders || []); }
  get displayForms(): string[] { return this.currentLang === 'ar' && this.product.formsAr?.length ? this.product.formsAr : (this.product.forms || []); }
  get displayContainerCapacity(): string[] { return this.currentLang === 'ar' && this.product.containerCapacityAr?.length ? this.product.containerCapacityAr : (this.product.containerCapacity || []); }

  productId: any;
  isLoading: boolean = true;
  orderLoading: boolean = false;

  ngOnInit() {
    this.environmentPicurl=environment.FilesURL;
    this.activatedRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.getProduct(id);
    });
  }

  getProduct(productId: number): void {
    this.productsService.getProduct(productId).subscribe({
      next: (res) => {
        this.product = res;
        this.isLoading = false;
        this.setSeoTags();
      }
    });
  }

  setSeoTags(): void {
    const lang = this.currentLang;
    const imageUrl = this.product.pictureUrl || '';
    const name = lang === 'ar' ? (this.product.nameAr || this.product.name) : this.product.name;
    const sciName = lang === 'ar' ? (this.product.scientificNameAr || this.product.scientificName) : this.product.scientificName;
    const wonders = lang === 'ar' ? (this.product.naturalWondersAr?.length ? this.product.naturalWondersAr : this.product.naturalWonders) : this.product.naturalWonders;

    if (lang === 'ar') {
      this.title.setTitle(`${name} | رضومنتا`);
      this.meta.updateTag({
        name: 'description',
        content: wonders?.join('، ') ||
                 `منتج طبيعي من ${this.product.category?.nameAr || this.product.category?.name || this.product.categoryName} مقدم من رضومنتا.`
      });
      this.meta.updateTag({
        name: 'keywords',
        content: `${name}, ${sciName}, ${this.product.category?.nameAr || this.product.category?.name || this.product.categoryName}, أعشاب طبيعية, زيوت طبيعية, رضومنتا`
      });
      this.meta.updateTag({ property: 'og:title', content: `${name} | رضومنتا` });
      this.meta.updateTag({ property: 'og:description', content: wonders?.join('، ') || '' });
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:type', content: 'product' });
      this.meta.updateTag({ name: 'language', content: 'ar' });
    } else {
      this.title.setTitle(`${name} | Radwaminta`);
      this.meta.updateTag({
        name: 'description',
        content: wonders?.join(', ') ||
                 `A premium herbal product from ${this.product.category?.name || this.product.categoryName} by Radwaminta.`
      });
      this.meta.updateTag({
        name: 'keywords',
        content: `${name}, ${sciName}, ${this.product.category?.name || this.product.categoryName}, Egyptian herbs, natural oils, Radwaminta`
      });
      this.meta.updateTag({ property: 'og:title', content: `${name} | Radwaminta` });
      this.meta.updateTag({ property: 'og:description', content: wonders?.join(', ') || '' });
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:type', content: 'product' });
      this.meta.updateTag({ name: 'language', content: 'en' });
    }

    this.addSchemaData(imageUrl, lang, name, wonders);
  }

  addSchemaData(imageUrl: string, lang: string, name: string | undefined, wonders: string[] | undefined): void {
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': name,
      'image': imageUrl,
      'description': wonders?.join(lang === 'ar' ? '، ' : ', '),
      'brand': {
        '@type': 'Brand',
        'name': 'Radwaminta'
      },
      'category': this.product.category?.name || this.product.categoryName,
      'sku': `${this.product.id}`,
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/InStock'
      }
    };

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  environmentPicurl : any
  orderNow(): void {
    this.orderLoading = true;
    this.productsService.orderNow(this.product.id).subscribe({
      next: (res) => {
        window.location.href = res.whatsappLink;
        this.orderLoading = false;
      },
      error:(err)=>{
        this.orderLoading = false;
      }
    });
  }
}



// import { Component, inject, OnInit } from '@angular/core';
// import { ProductsService } from '../../core/services/products/products.service';
// import { ActivatedRoute } from '@angular/router';
// import { Iproduct } from '../../shared/interfaces/iproduct';
// import { RelatedProductsComponent } from "../../shared/components/related-products/related-products.component";
// import { TranslateModule } from '@ngx-translate/core';

// @Component({
//   selector: 'app-product-details',
//   imports: [RelatedProductsComponent,TranslateModule],
//   templateUrl: './product-details.component.html',
//   styleUrl: './product-details.component.scss'
// })
// export class ProductDetailsComponent implements OnInit{
//   private readonly productsService = inject(ProductsService);
//   private readonly activatedRoute = inject(ActivatedRoute);
//   product:Iproduct={
//     id: 0,
//     name: '',
//     pictureUrl: '',
//     scientificName: '',
//     forms: [],
//     activeIngredients: [],
//     harvestSeason: [],
//     availability: '',
//     containerCapacity: [],
//     naturalWonders: [],
//     categoryId: 0,
//     categoryName: ''
//   }
//   productId:any;
//   isLoading:boolean = true;
//   orderLoading:boolean = false;

//   ngOnInit(){
//     this.activatedRoute.paramMap.subscribe(params => {
//       const id = Number(params.get('id'));
//       if (id) {
//         this.getProduct(id);
//       }
//     });
//   }
//   getProduct(productId:number):void{
//     this.productsService.getProduct(productId).subscribe({
//       next:(res)=>{
//         this.product = res;
//         this.isLoading = false;
//       }
//     })
//   }
//   orderNow():void{
//     this.orderLoading = true;
//     this.productsService.orderNow(this.product.id).subscribe({
//       next:(res)=>{
//         window.location.href = res.whatsappLink;
//         this.orderLoading = false;
//       }
//     })
//   }

// }
