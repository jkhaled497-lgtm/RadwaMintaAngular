import { Component, inject, OnInit } from '@angular/core';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { Iproduct } from '../../shared/interfaces/iproduct';
import { ProductsService } from '../../core/services/products/products.service';
import { Router } from '@angular/router';
import { ProductCardSelektonComponent } from "../../shared/components/product-card-selekton/product-card-selekton.component";
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteProductModalComponent } from '../../shared/components/delete-product-modal/delete-product-modal.component';
import { AddNewsModalComponent } from '../../shared/components/add-news-modal/add-news-modal.component';
import { ManageNewsModalComponent } from '../../shared/components/manage-news-modal/manage-news-modal.component';
import { UpdateNewsModalComponent } from '../../shared/components/update-news-modal/update-news-modal.component';
import { NewsService } from '../../core/services/news/news.service';
import { INews } from '../../shared/interfaces/inews';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, ProductCardSelektonComponent, TranslateModule, DeleteProductModalComponent, AddNewsModalComponent, ManageNewsModalComponent, UpdateNewsModalComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly productsService = inject(ProductsService);
  private readonly newsService = inject(NewsService);
  private readonly router = inject(Router);

  get currentLang(): string {
    return typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en';
  }

  fetchedProducts: Iproduct[] = [];
  products: Iproduct[] = [];
  searchTerm: string = '';
  allCategories: any[] = [];
  activeCategory: string = '';
  loadingCategories: boolean = true;
  LoadingProducts: boolean = true;
  isAdmin: boolean = false;
  isAddModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  selectedProduct: Iproduct | null = null;

  isAddNewsModalOpen: boolean = false;
  isManageNewsModalOpen: boolean = false;
  isUpdateNewsModalOpen: boolean = false;
  selectedNews: INews | null = null;
  dynamicTickerItems: any[] = [];

  tickerItemsEn: string[] = [
    'Welcome to RadwaMinta - Your trusted resource worldwide.',
    'Producing, processing, and exporting high-quality herbs, spices and seeds since 2006.',
    'Authentic Flavors from the Land of the Pharaohs.',
    'We guarantee top-notch quality through continuous documentation and comprehensive testing.'
  ];

  tickerItemsAr: string[] = [
    'مرحباً بكم في رضومنتا - مصدركم الموثوق عالمياً.',
    'نقوم بإنتاج ومعالجة وتصدير الأعشاب والتوابل والبذور عالية الجودة منذ عام 2006.',
    'نكهات أصيلة من أرض الفراعنة.',
    'نضمن لكم منتجات عالية الجودة من خلال الاختبارات الشاملة والتوثيق المستمر.'
  ];

  get currentTickerItems(): any[] {
    const fixed = this.currentLang === 'ar' ? this.tickerItemsAr : this.tickerItemsEn;
    const fixedItems = fixed.map(text => ({ isDynamic: false, text }));
    
    const dynamicItems = this.dynamicTickerItems.map(n => ({
      isDynamic: true,
      // name: this.currentLang === 'ar' ? (n.nameAr || n.name) : n.name,
      about: this.currentLang === 'ar' ? (n.aboutAr || n.about) : n.about,
      description: this.currentLang === 'ar' ? (n.descriptionAr || n.description) : n.description
    }));
    
    return [...dynamicItems, ...fixedItems];
  }

  loadDynamicTickerNews(): void {
    this.newsService.getAllNews(this.currentLang).subscribe({
      next: (res: any[]) => {
        // Fetch all news and store the objects so we can use name, about, and description
        this.dynamicTickerItems = res;
      },
      error: () => {
        this.dynamicTickerItems = [];
      }
    });
  }

  openAddNewsModal(): void {
    if (!this.isAdmin) return;
    this.isAddNewsModalOpen = true;
  }

  openManageNewsModal(): void {
    if (!this.isAdmin) return;
    this.isManageNewsModalOpen = true;
  }

  openUpdateNewsModal(news: INews): void {
    if (!this.isAdmin) return;
    this.selectedNews = news;
    this.isUpdateNewsModalOpen = true;
    this.isManageNewsModalOpen = false;
  }

  closeNewsModals(): void {
    this.isAddNewsModalOpen = false;
    this.isManageNewsModalOpen = false;
    this.isUpdateNewsModalOpen = false;
    this.selectedNews = null;
    this.loadDynamicTickerNews();
  }

  openAddModal(): void {
    if (!this.isAdmin) return;
    this.router.navigate(['/dashboard/add-product']);
  }

  openUpdateModal(product: Iproduct): void {
    if (!this.isAdmin) return;
    this.router.navigate(['/dashboard/update-product', product.id]);
  }

  openDeleteModal(product: Iproduct): void {
    if (!this.isAdmin) return;
    this.selectedProduct = product;
    this.isDeleteModalOpen = true;
  }

  closeModalAndRefresh(): void {
    this.isAddModalOpen = false;
    this.isUpdateModalOpen = false;
    this.isDeleteModalOpen = false;
    this.selectedProduct = null;
    this.getAllProducts();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('token');
      this.isAdmin = !!token && userType?.trim().toLowerCase() === 'admin';
    }
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
    this.loadDynamicTickerNews();

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
        this.fetchedProducts = res;
        this.filterProducts();
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
        this.fetchedProducts = res;
        this.filterProducts();
        this.LoadingProducts = false;
      }
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.products = this.fetchedProducts;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.products = this.fetchedProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) || 
        (p.nameAr && p.nameAr.includes(term)) ||
        (p.scientificName && p.scientificName.toLowerCase().includes(term)) ||
        (p.scientificNameAr && p.scientificNameAr.includes(term))
      );
    }
  }
}
