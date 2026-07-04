import { TranslateModule } from '@ngx-translate/core';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LangChangeComponent } from "../lang-change/lang-change.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule, LangChangeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  sidebarOpen = false;
  lastScrollTop = 0;
  hideHeader = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
}
