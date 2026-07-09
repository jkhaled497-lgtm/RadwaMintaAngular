import { MediaService } from './../../core/services/media/media.service';
import { Component, inject, OnInit } from '@angular/core';
import { StorySectionComponent } from "../../shared/components/story-section/story-section.component";
import { ReviewsSectionComponent } from "../../shared/components/reviews-section/reviews-section.component";
import { FeaturedProductsComponent } from "../../shared/components/featured-products/featured-products.component";
import { ContactFormComponent } from "../../shared/components/contact-form/contact-form.component";
import { HeroCounterComponent } from "../../shared/components/hero-counter/hero-counter.component";
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    StorySectionComponent,
    ReviewsSectionComponent,
    FeaturedProductsComponent,
    ContactFormComponent,
    HeroCounterComponent,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta,
    private translate: TranslateService
  ) {}

  private readonly mediaService = inject(MediaService);
  isLoading: boolean = true;
  whatsAppLink: string = '';
  faqs = [{ open: false }, { open: false }, { open: false }, { open: false },{open:false}];

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
}
