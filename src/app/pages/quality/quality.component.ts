import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { ProcessingStageSectionComponent } from "../../shared/components/processing-stage-section/processing-stage-section.component";
import { TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-quality',
  imports: [ProcessingStageSectionComponent, TranslateModule],
  templateUrl: './quality.component.html',
  styleUrl: './quality.component.scss'
})
export class QualityComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  @ViewChild('samplingProcedure') samplingProcedure!: ElementRef;
  @ViewChild('processingStages') processingStages!: ElementRef;
  @ViewChild('packingLabeling') packingLabeling!: ElementRef;
  @ViewChild('certificates') certificates!: ElementRef;

  ngOnInit(): void {
    const lang = localStorage.getItem('lang') || 'en';

    if (lang === 'ar') {
      this.title.setTitle('الجودة | رضومنتا');
      this.meta.addTags([
        {
          name: 'description',
          content:
            'في رضومنتا، نلتزم بأعلى معايير الجودة من خلال إجراءات فحص دقيقة، مراحل معالجة حديثة، وتعبئة مطابقة للمعايير الدولية لضمان منتجات طبيعية آمنة وعالية النقاء.'
        },
        {
          name: 'keywords',
          content:
            'الجودة, رضومنتا, مراقبة الجودة, معايير الجودة, الأعشاب المصرية, معالجة الأعشاب, التعبئة والتغليف, منتجات طبيعية آمنة'
        },
        { property: 'og:title', content: 'الجودة | رضومنتا' },
        {
          property: 'og:description',
          content:
            'اكتشف معايير الجودة الصارمة التي تتبعها رضومنتا في كل مرحلة من مراحل الإنتاج — من أخذ العينات حتى التعبئة والتغليف.'
        },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'ar' }
      ]);
    } else {
      this.title.setTitle('Quality | Radwaminta');
      this.meta.addTags([
        {
          name: 'description',
          content:
            'At Radwaminta, quality is a promise. From precise sampling and processing stages to professional packing, every product meets the highest international standards.'
        },
        {
          name: 'keywords',
          content:
            'Radwaminta quality, quality control, herbs processing, Egyptian herbs, product safety, packaging standards, natural oils quality'
        },
        { property: 'og:title', content: 'Quality | Radwaminta' },
        {
          property: 'og:description',
          content:
            'Explore how Radwaminta ensures quality at every stage — from sampling to labeling — to deliver pure and safe natural products.'
        },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'en' }
      ]);
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": lang === 'ar' ? "الجودة | رضومنتا" : "Quality | Radwaminta",
      "url": "https://radwaminta.com/quality",
      "description": lang === 'ar'
        ? "صفحة توضح معايير الجودة والإجراءات الصارمة التي تتبعها شركة رضومنتا في إنتاج الأعشاب والزيوت الطبيعية."
        : "Page describing Radwaminta's strict quality and safety procedures for producing herbs and natural oils.",
      "publisher": {
        "@type": "Organization",
        "name": "Radwaminta",
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  scrollToSection(section: string): void {
    let element: ElementRef;

    switch (section) {
      case 'sampling-procedure':
        element = this.samplingProcedure;
        break;
      case 'processing-stages':
        element = this.processingStages;
        break;
      case 'packing-labeling':
        element = this.packingLabeling;
        break;
      case 'certificates':
        element = this.certificates;
        break;
      default:
        return;
    }

    if (element) {
      element.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
