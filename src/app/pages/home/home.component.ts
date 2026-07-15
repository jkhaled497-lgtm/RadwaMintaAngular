import { MediaService } from './../../core/services/media/media.service';
import { Component, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { StorySectionComponent } from "../../shared/components/story-section/story-section.component";
import { ReviewsSectionComponent } from "../../shared/components/reviews-section/reviews-section.component";
import { FeaturedProductsComponent } from "../../shared/components/featured-products/featured-products.component";
import { ContactFormComponent } from "../../shared/components/contact-form/contact-form.component";
import { HeroCounterComponent } from "../../shared/components/hero-counter/hero-counter.component";
import { NewsTickerComponent } from "../../shared/components/news-ticker/news-ticker.component";
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { VisitorService } from '../../core/services/visitor.service';

@Component({
  selector: 'app-home',
  imports: [
    StorySectionComponent,
    ReviewsSectionComponent,
    FeaturedProductsComponent,
    ContactFormComponent,
    HeroCounterComponent,
    NewsTickerComponent,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private title: Title,
    private meta: Meta,
    private translate: TranslateService
  ) {}

  private readonly mediaService = inject(MediaService);
  public visitorService = inject(VisitorService);
  public platformId = inject(PLATFORM_ID);
  public animatedVisitorCount: number = 0;
  private visitorSub!: Subscription;
  private animationFrameId?: number;
  isLoading: boolean = true;
  whatsAppLink: string = '';
  faqs = [{ open: false }, { open: false }, { open: false }, { open: false },{open:false}];

  get formattedVisitorCount(): string {
    if (this.animatedVisitorCount >= 100000) {
      const thousands = Math.floor(this.animatedVisitorCount / 1000);
      return `+${thousands}K`;
    }
    return this.animatedVisitorCount.toString();
  }

  ngOnInit() {
    const currentLang = this.translate.currentLang || 'en';

    if (currentLang === 'ar') {
      this.title.setTitle('رضومنتا | أعشاب وزيوت طبيعية');
      this.meta.addTags([
        { name: 'description', content: 'تأسست رضومنتا عام 2006 لإنتاج وتجهيز وتصدير الأعشاب والتوابل والبذور والزيوت الطبيعية عالية الجودة من مصر.' },
        { name: 'keywords', content: 'أعشاب مصرية, زيوت طبيعية, توابل, مزارع الفيوم, رضومنتا' },
        { property: 'og:title', content: 'رضومنتا' },
        { property: 'og:description', content: 'اكتشف أجود أنواع الأعشاب والتوابل والزيوت الطبيعية من مصر.' },
        { property: 'og:image', content: '/favicon.png'},
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'ar' },
      ]);
    } else {
      this.title.setTitle('Radwaminta | Natural herbs and oils');
      this.meta.addTags([
        { name: 'description', content: 'Radwaminta has been producing, processing, and exporting high-quality herbs, spices, seeds, and natural oils since 2006 from Egypt.' },
        { name: 'keywords', content: 'Egyptian herbs, natural oils, spices, Fayoum farms, Radwaminta' },
        { property: 'og:title', content: 'Radwaminta' },
        { property: 'og:description', content: 'Discover high-quality herbs, spices, and essential oils from Egypt.' },
        { property: 'og:image', content: '/favicon.png' },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'en' },
      ]);
    }

    this.getWhatsAppLink();

    this.visitorSub = this.visitorService.visitorCount$.subscribe(count => {
      this.animateCount(this.animatedVisitorCount, count);
    });
  }

  animateCount(start: number, end: number) {
    if (!isPlatformBrowser(this.platformId)) {
      this.animatedVisitorCount = end;
      return;
    }

    if (start === end) return;
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.animatedVisitorCount = Math.floor(start + (end - start) * easeOut);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(step);
      } else {
        this.animatedVisitorCount = end;
      }
    };

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame(step);
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  getWhatsAppLink(): void {
    this.mediaService.getWhatsAppLink().subscribe({
      next: (res) => {
        this.whatsAppLink = res.whatsApp;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.visitorSub) this.visitorSub.unsubscribe();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}
