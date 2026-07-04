import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private titleService = inject(Title);
  errorMsg: string = '';

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  constructor() {
    this.setPageTitle();
  }

  private setPageTitle(): void {
    const lang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
    const titles: Record<string, string> = {
      en: 'Login | Radwaminta',
      ar: 'رضومنتا | تسجيل الدخول'
    };
    this.titleService.setTitle(titles[lang]);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.authenticationService.login(this.form.value).subscribe({
        next: (res) => {
          if (res.success) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMsg = res.message;
            setTimeout(() => {
              this.errorMsg = '';
            }, 5000);
          }
        }
      });
    }
  }
}
