import { Component, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl,FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule,TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements AfterViewInit {
  @ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;
   constructor() {
    this.setPageTitle(); 
    if (this.steps() === 2) this.startTimer();
  }
  private titleService = inject(Title);
  showPassword = false;
  showConfirmPassword = false;
  steps = signal(1);
  message: string = '';
  userId: any = '';
  timer: number = 60;
  otpArray = new Array(6);
  otpCode: string = '';
  otpDisplay: string[] = [];
  activeIndex = 0;
  loading = false;

  router = inject(Router);
  authenticationService = inject(AuthenticationService);

  forgotPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
  });

  checkCodeForm: FormGroup = new FormGroup({
    code: new FormControl(null, [Validators.required]),
  });

  passwordForm: FormGroup = new FormGroup(
    {
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\W).*$/),
      ]),
      confirmPassword: new FormControl(null),
    },
    { validators: ForgotPasswordComponent.confirmpassword }
  );



  static confirmpassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('confirmPassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  ngAfterViewInit() {
    if (this.steps() === 2) {
      setTimeout(() => {
        this.otpInput?.nativeElement?.focus();
      }, 300);
    }
  }

  submitEmail(): void {
    this.forgotPassword.markAllAsTouched();
    if (this.forgotPassword.valid) {
      this.loading = true;
      this.authenticationService.forgotPassword(this.forgotPassword.value).subscribe({
        next: (res) => {
          this.steps.set(2);
          this.message = '';
          this.startTimer();
          setTimeout(() => this.otpInput?.nativeElement?.focus(), 300);
        },
        complete: () => (this.loading = false),
      });
    }
  }

  verifyCode(): void {
    this.checkCodeForm.markAllAsTouched();
    if (this.checkCodeForm.valid) {
      this.loading = true;
      const payload = {
        email: this.forgotPassword.get('email')?.value,
        otp: this.checkCodeForm.get('code')?.value,
      };
      this.authenticationService.checkCode(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.steps.set(3);
          } else {
            this.message = res.message;
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
        },
        complete: () => (this.loading = false),
      });
    }
  }

  resendCode(): void {
    this.timer = 60;
    this.authenticationService.resendCode(this.forgotPassword.value).subscribe({
      next: () => {
        this.startTimer();
      },
    });
  }

  startTimer(): void {
    const interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) clearInterval(interval);
    }, 1000);
  }

  setPassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.valid) {
      this.loading = true;
      const payload = {
        email: this.forgotPassword.get('email')?.value,
        otp: this.checkCodeForm.get('code')?.value,
        newPassword: this.passwordForm.get('password')?.value,
        confirmNewPassword: this.passwordForm.get('confirmPassword')?.value,
      };

      this.authenticationService.resetPassword(payload).subscribe({
        next: (res) => {
            this.router.navigate(['/login']);
        },
        complete: () => (this.loading = false),
      });
    }
  }

  onOtpChange(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.checkCodeForm.get('code')?.setValue(value);
    this.otpDisplay = value.split('');
    this.activeIndex = value.length < 6 ? value.length : 5;

    if (value.length === 6) {
      setTimeout(() => this.verifyCode(), 200);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
   private setPageTitle(): void {
    const lang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
    const titles: Record<string, string> = {
      en: 'Radwaminta | Forgot Password',
      ar: 'رضومنتا | نسيت كلمة المرور '
    };
    this.titleService.setTitle(titles[lang]);
  }
}




// import { Component, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import {
//   AbstractControl,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { AuthenticationService } from '../../core/services/authentication/authentication.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-forgot-password',
//   imports: [ReactiveFormsModule],
//   templateUrl: './forgot-password.component.html',
//   styleUrl: './forgot-password.component.scss',
// })
// export class ForgotPasswordComponent implements AfterViewInit {
//   @ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;

//   showPassword = false;
//   showConfirmPassword = false;
//   steps = signal(1);
//   message: string = '';
//   userId: any = '';
//   timer: number = 60;
//   otpArray = new Array(6);
//   otpCode: string = '';
//   otpDisplay: string[] = [];
//   activeIndex = 0;

//   router = inject(Router);
//   authenticationService = inject(AuthenticationService);

//   forgotPassword: FormGroup = new FormGroup({
//     email: new FormControl(null, [Validators.email, Validators.required]),
//   });

//   checkCodeForm: FormGroup = new FormGroup({
//     code: new FormControl(null, [Validators.required]),
//   });

//   passwordForm: FormGroup = new FormGroup(
//     {
//       password: new FormControl(null,[Validators.required,Validators.minLength(8),Validators.pattern( /^(?=.*[A-Z])(?=.*\W).*$/)]),
//       confirmPassword: new FormControl(null),
//     },
//     { validators: this.confirmpassword }
//   );

//   constructor() {
//     if (this.steps() === 2) this.startTimer();
//   }

//   ngAfterViewInit() {
//     if (this.steps() === 2) {
//       setTimeout(() => {
//         this.otpInput?.nativeElement?.focus();
//       }, 300);
//     }
//   }

//   confirmpassword(group: AbstractControl) {
//     const password = group.get('password')?.value;
//     const rePassword = group.get('confirmPassword')?.value;
//     return password === rePassword ? null : { mismatch: true };
//   }

//   submitEmail(): void {
//     this.forgotPassword.markAllAsTouched();
//     if (this.forgotPassword.valid) {
//       this.authenticationService
//         .forgotPassword(this.forgotPassword.value)
//         .subscribe({
//           next: (res) => {
//             this.steps.set(2);
//             this.message = '';
//             this.startTimer();

//             setTimeout(() => {
//               this.otpInput?.nativeElement?.focus();
//             }, 300);
//           }
//         });
//     }
//   }

//   verifyCode(): void {
//     this.checkCodeForm.markAllAsTouched();
//     if (this.checkCodeForm.valid) {
//       const payload = {
//         email: this.forgotPassword.get('email')?.value,
//         otp: this.checkCodeForm.get('code')?.value,
//       };
//       this.authenticationService.checkCode(payload).subscribe({
//         next: (res) => {
//           if (res.success) {
//             this.steps.set(3);
//           } else {
//             this.message = res.message;
//             setTimeout(() => { this.message = ''; }, 3000);
//           }
//         },
//       });
//     }
//   }

//   resendCode(): void {
//     this.timer = 60;
//     this.authenticationService.resendCode(this.forgotPassword.value).subscribe({
//       next: () => {
//         this.startTimer();
//       }
//     });
//   }

//   startTimer(): void {
//     const interval = setInterval(() => {
//       this.timer--;
//       if (this.timer <= 0) clearInterval(interval);
//     }, 1000);
//   }

//   setPassword(): void {
//     this.passwordForm.markAllAsTouched();
//     if (this.passwordForm.valid) {
//       const payload = {
//         email: this.forgotPassword.get('email')?.value,
//         otp: this.checkCodeForm.get('code')?.value,
//         newPassword: this.passwordForm.get('password')?.value,
//         confirmNewPassword: this.passwordForm.get('confirmPassword')?.value
//       };
//       console.log(payload);
      
//       this.authenticationService.resetPassword(payload).subscribe({
//         next: (res) => {
//           console.log(res);
          
//           if (res.status === 'success') {
//             this.router.navigate(['/login']);
//           } 
//           else{
//             this.message = res.message;
//             setTimeout(() => { this.message = ''; }, 3000);
//           }
//         }
//       });
//     }
//   }

//   onOtpChange(event: any) {
//     const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
//     this.checkCodeForm.get('code')?.setValue(value);
//     this.otpDisplay = value.split('');
//     this.activeIndex = value.length < 6 ? value.length : 5;

//     if (value.length === 6) {
//       setTimeout(() => this.verifyCode(), 200);
//     }
//   }

//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPassword() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }
// }
