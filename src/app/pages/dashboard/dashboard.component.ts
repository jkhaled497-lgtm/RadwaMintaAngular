import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private titleService = inject(Title); 

  ngOnInit(): void {
    this.setPageTitle();
  }

  logout(): void {  
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    this.router.navigate(['/home']);
  }

  private setPageTitle(): void {
    const lang = (typeof window !== 'undefined' && localStorage.getItem('lang') === 'ar') ? 'ar' : 'en';
    const titles: Record<string, string> = {
      en: 'Dashboard | Radwaminta',
      ar: 'لوحة التحكم | رضومنتا'
    };
    this.titleService.setTitle(titles[lang]);
  }
}
