import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../../../core/services/news/news.service';
import { INews } from '../../interfaces/inews';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-ticker',
  imports: [TranslateModule, CommonModule],
  templateUrl: './news-ticker.component.html',
  styleUrl: './news-ticker.component.scss'
})
export class NewsTickerComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  public translate = inject(TranslateService);
  private langSub!: Subscription;

  newsList: INews[] = [];
  isLoading = true;

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

  get currentLang(): string {
    return this.translate.currentLang || (typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en');
  }

  get currentTickerItems(): any[] {
    const fixed = this.currentLang === 'ar' ? this.tickerItemsAr : this.tickerItemsEn;
    const fixedItems = fixed.map(text => ({ isDynamic: false, text }));
    
    const dynamicItems = this.newsList.map((n: any) => ({
      isDynamic: true,
      about: this.currentLang === 'ar' ? (n.aboutAr || n.about) : n.about,
      description: this.currentLang === 'ar' ? (n.descriptionAr || n.description) : n.description
    }));
    
    return [...dynamicItems, ...fixedItems];
  }

  ngOnInit(): void {
    this.loadTickerNews(this.currentLang);
    
    // Reload when language changes
    this.langSub = this.translate.onLangChange.subscribe((event) => {
      this.loadTickerNews(event.lang);
    });
  }

  loadTickerNews(lang: string): void {
    this.isLoading = true;
    
    // Fetch all news and show them in the ticker as requested
    this.newsService.getAllNews(lang).subscribe({
      next: (res) => {
        this.newsList = res;
        this.isLoading = false;
      },
      error: () => {
        this.newsList = [];
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }
}
