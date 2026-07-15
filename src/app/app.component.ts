import { Component, HostListener, Inject, PLATFORM_ID, Optional, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';
import { ChatComponent } from './pages/chat/chat.component';
import { VisitorService } from './core/services/visitor.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CarouselModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'radwaminta';
    isLoading: any;
  constructor(
    private translate: TranslateService, 
    private VisitorService: VisitorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('en');
    // this.translate.use('en');
    
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.VisitorService.init();
    }
  }

@HostListener('document:mousemove', ['$event'])
onMouseMove(e: MouseEvent) {
  document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
  document.documentElement.style.setProperty('--my', `${e.clientY}px`);

  // عدد الذرات في كل حركة
  const particleCount = 8; // أكتر من قبل
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // انتشار أبعد (مضاعف)
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.5) * 120;

    particle.style.left = `${e.clientX + offsetX}px`;
    particle.style.top = `${e.clientY + offsetY}px`;

    // حجم عشوائي
    const size = Math.random() * 5 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // سرعة مختلفة لكل ذرة
    particle.style.animationDuration = `${1 + Math.random() * 1}s`;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1800);
  }
}



}
