import { Component, OnInit, inject } from '@angular/core';
import { ContactFormComponent } from "../../shared/components/contact-form/contact-form.component";
import { TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  imports: [ContactFormComponent, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    const lang = localStorage.getItem('lang') || 'en';

    if (lang === 'ar') {
      this.title.setTitle('تواصل معنا | رضومنتا');
      this.meta.addTags([
        {
          name: 'description',
          content:
            'هل لديك استفسارات أو ترغب في تحديد موعد؟ تواصل مع رضومنتا عبر البريد الإلكتروني أو الهاتف أو نموذج التواصل — نحن دائمًا هنا لمساعدتك.'
        },
        {
          name: 'keywords',
          content:
            'تواصل معنا, رضومنتا, تواصل, استفسارات, بريد إلكتروني, هاتف, أعشاب مصرية, زيوت طبيعية'
        },
        { property: 'og:title', content: 'تواصل معنا | رضومنتا' },
        {
          property: 'og:description',
          content:
            'نحن هنا لمساعدتك والإجابة على جميع أسئلتك حول منتجات رضومنتا الطبيعية.'
        },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'ar' }
      ]);
    } else {
      this.title.setTitle('Contact Us | Radwaminta');
      this.meta.addTags([
        {
          name: 'description',
          content:
            'Have a question or want to schedule a meeting? Contact Radwaminta via email, phone, or our online form — we are here to help you anytime.'
        },
        {
          name: 'keywords',
          content:
            'Radwaminta contact, get in touch, Egyptian herbs company, customer support, natural oils supplier, contact form'
        },
        { property: 'og:title', content: 'Contact Us | Radwaminta' },
        {
          property: 'og:description',
          content:
            'Get in touch with Radwaminta — our team is ready to answer your questions and provide support.'
        },
        { property: 'og:type', content: 'website' },
        { name: 'language', content: 'en' }
      ]);
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Radwaminta",
        "url": "https://radwaminta.com/contact",
        "email": "radwa@radwaminta.com",
        "telephone": "+201095110025",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+201095110025",
          "contactType": lang === 'ar' ? "دعم العملاء" : "Customer Service",
          "availableLanguage": ["English", "Arabic"]
        },
        "logo": "/images/logo.png",
      },
      "description": lang === 'ar'
        ? "صفحة التواصل مع شركة رضومنتا — يمكنك إرسال رسالة أو التواصل مباشرة عبر البريد الإلكتروني أو الهاتف."
        : "Contact page for Radwaminta — you can send a message or reach us directly via email or phone."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
