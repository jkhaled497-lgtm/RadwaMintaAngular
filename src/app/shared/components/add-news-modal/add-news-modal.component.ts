import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../core/services/news/news.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-news-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-news-modal.component.html',
  styleUrls: ['./add-news-modal.component.scss']
})
export class AddNewsModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  private newsService = inject(NewsService);

  isSubmitting = false;
  errorMsg = '';

  newsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    nameAr: new FormControl('', [Validators.required]),
    about: new FormControl('', [Validators.required]),
    aboutAr: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    descriptionAr: new FormControl('', [Validators.required])
  });

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';

    this.newsService.createNews(this.newsForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.closeModal.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMsg = err.error?.message || 'Server error';
      }
    });
  }
}
