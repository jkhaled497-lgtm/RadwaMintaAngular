import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { AdminService } from '../../core/services/admin/admin.service';
import { MediaLinks } from '../../shared/interfaces/media-links';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-social-media-links',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './social-media-links.component.html',
  styleUrls: ['./social-media-links.component.scss']
})
export class SocialMediaLinksComponent implements OnInit {
  private readonly adminService = inject(AdminService); 
  private titleService = inject(Title); 
  private translateService = inject(TranslateService);

  socialLinks: MediaLinks = {
    facebook: '',
    whatsApp: '',
    instagram: '',
    youtube: '',
    x: '',
    pinterest: '',
    linkedIn: ''
  };

  loading: boolean = false;
  successMessage: string = '';

  socialForm: FormGroup = new FormGroup({
    facebook: new FormControl(null),
    whatsApp: new FormControl(null),
    instagram: new FormControl(null),
    youtube: new FormControl(null),
    x: new FormControl(null),
    pinterest: new FormControl(null),
    linkedIn: new FormControl(null),
  });

  ngOnInit(): void {
    this.setPageTitle();
    this.getMediaLinks();
  }

  updateSocialLinks() {
    this.loading = true;
    this.successMessage = '';

    this.adminService.updateMediaLinks(this.socialForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = this.translateService.instant('SOCIAL_MEDIA_PAGE.SUCCESS_MSG');
        this.socialLinks = this.socialForm.value;
        this.getMediaLinks();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.successMessage = this.translateService.instant('SOCIAL_MEDIA_PAGE.ERROR_MSG');
        setTimeout(() => this.successMessage = '', 3000);
      }
    });
  }

  getMediaLinks(): void {
    this.adminService.getMediaLinks().subscribe({
      next: (res) => {
        this.socialForm.patchValue({
          facebook: res.facebook,
          whatsApp: res.whatsApp,
          instagram: res.instagram,
          youtube: res.youtube,
          x: res.x,
          pinterest: res.pinterest,
          linkedIn: res.linkedIn
        });
        this.socialLinks = this.socialForm.value;
      }
    })
  }

   private setPageTitle(): void {
    const lang = (typeof window !== 'undefined' && localStorage.getItem('lang') === 'ar') ? 'ar' : 'en';
    const titles: Record<string, string> = {
      en: 'Social Media Links | Radwaminta',
      ar: 'روابط السوشيال ميديا | رضومنتا'
    };
    this.titleService.setTitle(titles[lang]);
  }
}
