import { TranslateModule } from '@ngx-translate/core';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LangChangeComponent } from "../lang-change/lang-change.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule, LangChangeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private router = inject(Router);
  private eRef = inject(ElementRef);
  
  sidebarOpen = false;
  profileDropdownOpen = false;
  lastScrollTop = 0;
  hideHeader = false;
  isLoggedIn = false;
  isAdmin = false;
  userEmail = '';

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.isLoggedIn = !!localStorage.getItem('token');
        this.userEmail = localStorage.getItem('email') || '';
        
        const UserTypeForUser = localStorage.getItem('userType');
        this.isAdmin = UserTypeForUser === '3' || UserTypeForUser === 'Admin';
      }
    });
  }
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.profileDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.profileDropdownOpen = false;
    }
  }

  @HostListener('window:scroll', []) onWindowScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > this.lastScrollTop) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  signOut() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const lang = localStorage.getItem('lang');
      localStorage.clear();
      if (lang) {
        localStorage.setItem('lang', lang);
      }
    }
    this.profileDropdownOpen = false;
    this.router.navigate(['/login']);
  }
}
