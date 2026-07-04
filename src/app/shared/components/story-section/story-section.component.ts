import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: 'app-story-section',
  imports: [CarouselModule,RouterLink,TranslateModule],
  templateUrl: './story-section.component.html',
  styleUrl: './story-section.component.scss'
})
export class StorySectionComponent {
    images: string[] = [
    '/images/story-1.png',
    '/images/story-2.png',
    '/images/story-3.png',
    '/images/story-4.png',
    '/images/story-5.png',
  ];
  
  customOptions2: OwlOptions = {
    // rtl: true,
     rtl: document.dir === 'rtl',
    nav: true,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3000,
    loop: true,
    navText: [
      '<span class="w-10 h-10 rounded-full flex items-center justify-center "><i class="fa-solid fa-chevron-right"></i></span>',
      '<span class="w-10 h-10 rounded-full flex items-center justify-center "><i class="fa-solid fa-chevron-left"></i></span>'
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1
      },
      1200: {
        items: 1
      }
    }
  };
}
