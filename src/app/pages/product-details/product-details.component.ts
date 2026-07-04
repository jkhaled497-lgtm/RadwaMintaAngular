import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { RelatedProductsComponent } from "../../shared/components/related-products/related-products.component";
import { TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

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
  productId: any;
  isLoading: boolean = true;
  orderLoading: boolean = false;

  ngOnInit() {
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
    const lang = localStorage.getItem('lang') || 'en';
    const imageUrl = this.product.pictureUrl ;

    if (lang === 'ar') {
      this.title.setTitle(`${this.product.name} | رضومنتا`);
      this.meta.updateTag({
        name: 'description',
        content: this.product.naturalWonders?.join('، ') ||
                 `منتج طبيعي من ${this.product.categoryName} مقدم من رضومنتا.`
      });
      this.meta.updateTag({
        name: 'keywords',
        content: `${this.product.name}, ${this.product.scientificName}, ${this.product.categoryName}, أعشاب طبيعية, زيوت طبيعية, رضومنتا`
      });
      this.meta.updateTag({ property: 'og:title', content: `${this.product.name} | رضومنتا` });
      this.meta.updateTag({ property: 'og:description', content: this.product.naturalWonders?.join('، ') });
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:type', content: 'product' });
      this.meta.updateTag({ name: 'language', content: 'ar' });
    } else {
      this.title.setTitle(`${this.product.name} | Radwaminta`);
      this.meta.updateTag({
        name: 'description',
        content: this.product.naturalWonders?.join(', ') ||
                 `A premium herbal product from ${this.product.categoryName} by Radwaminta.`
      });
      this.meta.updateTag({
        name: 'keywords',
        content: `${this.product.name}, ${this.product.scientificName}, ${this.product.categoryName}, Egyptian herbs, natural oils, Radwaminta`
      });
      this.meta.updateTag({ property: 'og:title', content: `${this.product.name} | Radwaminta` });
      this.meta.updateTag({ property: 'og:description', content: this.product.naturalWonders?.join(', ') });
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:type', content: 'product' });
      this.meta.updateTag({ name: 'language', content: 'en' });
    }

    this.addSchemaData(imageUrl, lang);
  }

  addSchemaData(imageUrl: string, lang: string): void {
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': this.product.name,
      'image': imageUrl,
      'description': this.product.naturalWonders?.join(lang === 'ar' ? '، ' : ', '),
      'brand': {
        '@type': 'Brand',
        'name': 'Radwaminta'
      },
      'category': this.product.categoryName,
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
