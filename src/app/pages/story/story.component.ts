import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-story',
  imports: [TranslateModule, RouterLink],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private platformId = inject(PLATFORM_ID)
  ngOnInit(): void {
    let lang:any;
    if (isPlatformBrowser(this.platformId)) {
    lang = localStorage.getItem('lang') || 'en';
    }
    if (lang === 'ar') {
      this.title.setTitle('قصتنا | رضومنتا');
      this.meta.addTags([
        {
          name: 'description',
          content:
            'من جذور مصر القديمة إلى حاضرها المزدهر، رضومنتا تواصل إرث الملكة حتشبسوت في إنتاج الأعشاب والزيوت الطبيعية بأعلى جودة.'
        },
        {
          name: 'keywords',
          content:
            'رضومنتا, قصتنا, تاريخ رضومنتا, حتشبسوت, أعشاب مصرية, زيوت طبيعية, مزارع الفيوم, منتجات طبيعية'
        },
        { property: 'og:title', content: 'قصتنا | رضومنتا' },
        {
          property: 'og:description',
          content:
            'تعرف على رحلة رضومنتا من إرث حتشبسوت إلى الزراعة المستدامة الحديثة في مصر.'
        },
        { property: 'og:image', content: 'assets/images/story-hero.jpg' }, 
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'ar' }
      ]);
    } 
    else {
      this.title.setTitle('Our Story | Radwaminta');
      this.meta.addTags([
        {
          name: 'description',
          content:
            "From Egypt's ancient legacy to today's sustainable farms — Radwaminta continues Queen Hatshepsut's heritage in producing pure herbs and natural oils."
        },
        {
          name: 'keywords',
          content:
            'Radwaminta story, Egyptian herbs, Queen Hatshepsut, natural oils, sustainable farming, Egyptian legacy'
        },
        { property: 'og:title', content: 'Our Story | Radwaminta' },
        {
          property: 'og:description',
          content:
            "Discover Radwaminta's journey from ancient Egypt to modern herbal excellence."
        },
        { property: 'og:image', content: 'assets/images/story-hero.jpg' },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'en' }
      ]);
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": lang === 'ar' ? "قصتنا" : "our story",
      "url": "https://radwaminta.com/story",
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  
  scroll():void{
    window.scrollBy({
    top: 400,        
    left: 0,
    behavior: 'smooth' 
});
  }
}
