import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { CountryService } from '../../core/services/country/country.service';
import { CountryDTO } from '../../shared/interfaces/country';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  countries: CountryDTO[] = [];
  selectedCountryCode = '';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private countryService: CountryService,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required]],
      userType: [null, [Validators.required]],
      countryId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    this.registerForm.get('countryId')?.valueChanges.subscribe(id => {
      const country = this.countries.find(c => c.id === Number(id));
      if (country) {
        this.selectedCountryCode = country.code;
      }
    });
  }

  get currentLang(): string {
    return this.translateService.currentLang || (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'en';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  loadCountries(): void {
    this.countryService.getAllCountries().subscribe({
      next: (data) => {
        this.countries = data;
        const egypt = this.countries.find(c => c.nameEn.toLowerCase() === 'egypt');
        if (egypt) {
          this.registerForm.patchValue({ countryId: egypt.id });
        }
      },
      error: (err) => {
        console.error('Failed to load countries', err);
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = { ...this.registerForm.value };
      
      // Prepend country code if not already present
      if (this.selectedCountryCode && !formValue.phoneNumber.startsWith(this.selectedCountryCode)) {
        formValue.phoneNumber = this.selectedCountryCode + formValue.phoneNumber;
      }
      
      // Ensure userType and countryId are numbers
      formValue.userType = Number(formValue.userType);
      formValue.countryId = Number(formValue.countryId);

      this.authService.register(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Navigate to login or home after successful registration
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
