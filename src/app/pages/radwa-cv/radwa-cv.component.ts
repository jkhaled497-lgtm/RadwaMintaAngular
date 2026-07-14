import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EducationSectionComponent } from "../../shared/components/education-section/education-section.component";
import { InitiativesSectionComponent } from "../../shared/components/initiatives-section/initiatives-section.component";
import { CommunitySectionComponent } from "../../shared/components/community-section/community-section.component";
import { ExperienceSectionComponent } from "../../shared/components/experience-section/experience-section.component";
import { AutobiographySectionComponent } from "../../shared/components/autobiography-section/autobiography-section.component";
import { TranslateModule } from '@ngx-translate/core';

type Lang = 'en' | 'ar';

@Component({
  selector: 'app-radwa-cv',
  imports: [
    TranslateModule,
    EducationSectionComponent,
    InitiativesSectionComponent,
    CommunitySectionComponent,
    ExperienceSectionComponent,
    AutobiographySectionComponent
  ],
  templateUrl: './radwa-cv.component.html',
  styleUrl: './radwa-cv.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadwaCVComponent implements OnInit {
  tabName: string = 'autobiography';
  lang: Lang = 'en';

  constructor(private titleService: Title) {
    this.lang = (typeof window !== 'undefined' && localStorage.getItem('lang') === 'ar') ? 'ar' : 'en';
  }

  ngOnInit(): void {
    this.setPageTitle()
  }
  private setPageTitle(): void {
    const titles: Record<Lang, string> = {
      en: 'Radwa CV | Radwaminta',
      ar: 'السيرة الذاتية لرضوى | رضومنتا'
    };
    this.titleService.setTitle(titles[this.lang]);
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": this.lang === 'ar' ? "السيرة الذاتية لرضوى | رضومنتا" : "Radwa CV | Radwaminta",
        "url": "https://radwaminta.com/radwacv",
        "description": this.lang === 'ar'
          ? "تستعرض هذه الصفحة السيرة الذاتية لرضوى، بما في ذلك التعليم، الخبرات العملية، المبادرات، والعمل المجتمعي."
          : "This page showcases Radwa's CV, including education, professional experience, initiatives, and community work.",
        "publisher": {
          "@type": "Organization",
          "name": "Radwaminta"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

    
  }
}
