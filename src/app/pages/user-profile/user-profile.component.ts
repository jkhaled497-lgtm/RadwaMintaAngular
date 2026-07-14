import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private titleService = inject(Title);
  private authService = inject(AuthenticationService);
  private translateService = inject(TranslateService);

  userEmail: string = '';
  userType: string = '';
  imageUrl: string = '';
  phoneNumber: string = '';
  userName: string = '';
  
  isLoading: boolean = false;
  isSaving: boolean = false;
  isUploading: boolean = false;
  
  successMsg: string = '';
  errorMsg: string = '';
  baseUrl = (environment as any).imageUrl || (environment as any).FilesURL || 'https://localhost:7198/';

  form: FormGroup = new FormGroup({
    userName: new FormControl(''),
    dataBirthDate: new FormControl(''),
    address: new FormControl('')
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const lang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
      if (lang === 'en') {
        this.titleService.setTitle(this.translateService.instant('PROFILE_PAGE.TITLE') || 'Profile | Radwaminta');
      } else {
        this.titleService.setTitle(this.translateService.instant('PROFILE_PAGE.TITLE') || 'رضومنتا | الملف الشخصي');
      }
    }
    
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.userEmail = res.data.email;
          this.userType = res.data.userType;
          this.imageUrl = res.data.imageUrl;
          
          const code = res.data.countryCode || '';
          const phone = res.data.phonenumber || res.data.phoneNumber || '';
          this.phoneNumber = code ? (code +' '+ phone) : phone;
          
          let birthDateStr = '';
          if (res.data.dataBirthDate) {
            birthDateStr = new Date(res.data.dataBirthDate).toISOString().split('T')[0];
          }

          this.form.patchValue({
            userName: res.data.userName || res.data.name || res.data.username || '',
            dataBirthDate: birthDateStr,
            address: res.data.address
          });
          this.userName = this.form.value.userName;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = this.translateService.instant('PROFILE_PAGE.LOAD_ERROR');
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.authService.uploadImage(file).subscribe({
        next: (res: any) => {
          if (res.success && res.data) {
            this.imageUrl = res.data.url || res.data;
            this.saveProfile(); // Auto-save when image is uploaded
          }
          this.isUploading = false;
        },
        error: () => {
          this.errorMsg = this.translateService.instant('PROFILE_PAGE.UPLOAD_ERROR');
          this.isUploading = false;
          setTimeout(() => this.errorMsg = '', 3000);
        }
      });
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    const requestData = {
      userName: this.form.value.userName,
      dataBirthDate: this.form.value.dataBirthDate ? new Date(this.form.value.dataBirthDate).toISOString() : null,
      address: this.form.value.address,
      imageUrl: this.imageUrl
    };

    this.authService.updateProfile(requestData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = this.translateService.instant('PROFILE_PAGE.UPDATE_SUCCESS');
          setTimeout(() => this.successMsg = '', 3000);
        } else {
          this.errorMsg = res.message || this.translateService.instant('PROFILE_PAGE.UPDATE_ERROR');
          setTimeout(() => this.errorMsg = '', 3000);
        }
        this.isSaving = false;
      },
      error: () => {
        this.errorMsg = this.translateService.instant('PROFILE_PAGE.UPDATE_ERROR');
        this.isSaving = false;
        setTimeout(() => this.errorMsg = '', 3000);
      }
    });
  }

  getImagePath(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return this.baseUrl + url.replace(/\\/g, '/');
  }
}
