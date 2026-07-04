import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCounter]'
})
export class CounterDirective implements OnInit, OnDestroy {
  @Input() target = 0;  
  @Input() duration = 2000; 
  
  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    } else {
      this.el.nativeElement.innerText = '0+';
    }
  }

  private setupIntersectionObserver() {
    try {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter();
            if (this.observer) {
              this.observer.unobserve(this.el.nativeElement);
            }
          }
        });
      }, { threshold: 0.5 });

      this.observer.observe(this.el.nativeElement);
    } catch (error) {
      console.warn('IntersectionObserver not available:', error);
      this.animateCounter();
    }
  }

  private animateCounter() {
    let start = 0;
    const stepTime = Math.abs(Math.floor(this.duration / this.target));
    
    const timer = setInterval(() => {
      start++;
      this.el.nativeElement.innerText = start;
      if (start >= this.target) {
        clearInterval(timer);
        this.el.nativeElement.innerText = this.target + '+'; 
      }
    }, stepTime);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}