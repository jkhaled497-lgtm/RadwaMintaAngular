import { Component, inject, OnInit } from '@angular/core';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { Iproduct } from '../../shared/interfaces/iproduct';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductCardSelektonComponent } from "../../shared/components/product-card-selekton/product-card-selekton.component";
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, ProductCardSelektonComponent, TranslateModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly productsService = inject(ProductsService);

  products: Iproduct[] = [];
  allCategories: any[] = [];
  activeCategory: string = '';
  loadingCategories: boolean = true;
  LoadingProducts: boolean = true;

  ngOnInit(): void {
    const lang = localStorage.getItem("lang") || 'en';
    
    if (lang === 'en') {
      this.title.setTitle('Radwaminta | All Products');
      this.meta.addTags([
        { name: 'description', content: 'Explore our wide selection of high-quality Egyptian herbs, seeds, spices, and natural oils. Exported worldwide by Radwaminta since 2006.' },
        { name: 'keywords', content: 'Egyptian herbs, natural oils, spices, seeds, Radwaminta products' },
        { property: 'og:title', content: 'Radwaminta | All Products' },
        { property: 'og:description', content: 'Browse premium Egyptian herbs, spices, and natural oils available for export worldwide.' },
        { property: 'og:image', content: '/favicon.png' },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'en' }
      ]);
    } else {
      this.title.setTitle('رضومنتا | جميع المنتجات');
      this.meta.addTags([
        { name: 'description', content: 'اكتشف مجموعتنا الواسعة من الأعشاب والتوابل والبذور والزيوت الطبيعية عالية الجودة من مصر. رضومنتا – منذ عام 2006.' },
        { name: 'keywords', content: 'أعشاب مصرية, توابل, بذور, زيوت طبيعية, منتجات رضومنتا' },
        { property: 'og:title', content: 'رضومنتا | جميع المنتجات' },
        { property: 'og:description', content: 'تصفح أجود أنواع الأعشاب والتوابل والزيوت الطبيعية المتوفرة للتصدير من مصر.' },
        { property: 'og:image', content: '/favicon.png' },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'ar' }
      ]);
    }

    this.getAllCategories();
    this.getAllProducts();

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": lang === 'ar' ? "جميع منتجات رضومنتا" : "All Radwaminta Products",
      "url": "https://radwaminta.com/products",
      "description": lang === 'ar' 
        ? "صفحة تعرض جميع منتجات رضومنتا من أعشاب، توابل، بذور وزيوت طبيعية."
        : "Page showcasing all Radwaminta products including herbs, spices, seeds, and natural oils."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  getAllProducts(): void {
    this.activeCategory = 'All';
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.LoadingProducts = false;
      }
    });
  }

  getAllCategories(): void {
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories = res;
        this.loadingCategories = false;
      }
    });
  }

  getProductsByCategory(id: any, name: string): void {
    this.products = [];
    this.LoadingProducts = true;
    this.activeCategory = name;
    this.productsService.getProductsByCategory(id).subscribe({
      next: (res) => {
        this.products = res;
        this.LoadingProducts = false;
      }
    });
  }
}
