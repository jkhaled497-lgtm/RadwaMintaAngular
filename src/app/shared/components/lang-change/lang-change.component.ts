import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslationService } from '../../../core/services/translationn/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lang-change',
  imports: [],
  templateUrl: './lang-change.component.html',
  styleUrl: './lang-change.component.scss'
})
export class LangChangeComponent implements OnInit {
  private readonly myTranslationService = inject(TranslationService);
  private readonly ID: any = inject(PLATFORM_ID);
  private readonly router = inject(Router)
  currentLang: string = 'en';
  isLoading: boolean = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.ID)) {
      this.currentLang = localStorage.getItem('lang') || 'en';
    }
  }

  change(): void {
    this.isLoading = true; 
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.myTranslationService.changeLang(this.currentLang);
    window.location.reload();
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }
}
