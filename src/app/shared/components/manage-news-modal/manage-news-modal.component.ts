import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NewsService } from '../../../core/services/news/news.service';
import { INews } from '../../interfaces/inews';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-news-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './manage-news-modal.component.html',
  styleUrls: ['./manage-news-modal.component.scss']
})
export class ManageNewsModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() openUpdateModal = new EventEmitter<INews>();
  @Output() toggleTicker = new EventEmitter<INews>();

  private newsService = inject(NewsService);

  newsList: INews[] = [];
  isLoading = true;
  activeTickerIds: number[] = [];
  newsToDelete: INews | null = null;

  ngOnInit(): void {
    this.loadNews();
    this.loadActiveTickerIds();
  }

  loadNews(): void {
    this.isLoading = true;
    this.newsService.getAllNews().subscribe({
      next: (res) => {
        this.newsList = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadActiveTickerIds(): void {
    this.newsService.getTickerNews().subscribe({
      next: (res) => {
        this.activeTickerIds = res.map((n: INews) => n.id);
      },
      error: () => {
        this.activeTickerIds = [];
      }
    });
  }

  isActiveInTicker(id: number): boolean {
    return this.activeTickerIds.includes(id);
  }

  onToggleTicker(news: INews): void {
    const isCurrentlyActive = this.isActiveInTicker(news.id);
    const newStatus = !isCurrentlyActive;
    
    // Optimistic UI update could be done, but we wait for the backend here
    this.newsService.toggleTicker(news.id, newStatus).subscribe({
      next: () => {
        if (newStatus) {
          this.activeTickerIds.push(news.id);
        } else {
          this.activeTickerIds = this.activeTickerIds.filter(x => x !== news.id);
        }
        this.toggleTicker.emit(news); // notify parent to refresh ticker
      },
      error: (err) => {
        console.error('Failed to toggle ticker', err);
        alert('Failed to update ticker status.');
      }
    });
  }

  onUpdate(news: INews): void {
    this.openUpdateModal.emit(news);
  }

  onDelete(news: INews): void {
    this.newsToDelete = news;
  }

  cancelDelete(): void {
    this.newsToDelete = null;
  }

  confirmDelete(): void {
    if (this.newsToDelete) {
      this.newsService.deleteNews(this.newsToDelete.id).subscribe({
        next: () => {
          this.newsToDelete = null;
          this.loadNews();
        }
      });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
