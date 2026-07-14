import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, ClientService } from '../../core/services/client.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  totalCount: number = 0;
  
  // Pagination
  pageNumber: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;

  // Filters
  filterName: string = '';
  filterCountry: string = '';
  filterUserType: string = '';

  isLoading: boolean = false;
  environmentImageUrl = environment.FilesURL;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getClients(this.pageNumber, this.pageSize, this.filterName, this.filterCountry, this.filterUserType).subscribe({
      next: (response) => {
        this.clients = response.items || [];
        this.totalCount = response.totalCount || 0;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching clients', err);
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.pageNumber = 1; // Reset to first page when filtering
    this.loadClients();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadClients();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadClients();
    }
  }

  getUserTypeLabel(type: number): string {
    switch (type) {
      case 1: return 'Normal User';
      case 2: return 'Supplier';
      case 3: return 'Admin';
      default: return 'Unknown';
    }
  }
}
