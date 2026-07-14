import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../core/services/news/news.service';
import { INews } from '../../interfaces/inews';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-update-news-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './update-news-modal.component.html',
  styleUrls: ['./update-news-modal.component.scss']
})
export class UpdateNewsModalComponent implements OnInit {
  @Input() newsItem!: INews;
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

  ngOnInit(): void {
    if (this.newsItem) {
      // Pre-fill what we have. Arabic fields might be empty if backend doesn't send them in the DTO
      this.newsForm.patchValue({
        name: this.newsItem.name || '',
        nameAr: (this.newsItem as any).nameAr || '',
        about: this.newsItem.about || '',
        aboutAr: (this.newsItem as any).aboutAr || '',
        description: this.newsItem.description || '',
        descriptionAr: (this.newsItem as any).descriptionAr || ''
      });
    }
  }

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

    const payload = {
      id: this.newsItem.id,
      ...this.newsForm.value
    };

    this.newsService.updateNews(this.newsItem.id, payload).subscribe({
      next: () => {
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
