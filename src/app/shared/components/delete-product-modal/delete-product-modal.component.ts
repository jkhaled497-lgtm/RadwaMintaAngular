import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-product-modal',
  imports: [TranslateModule],
  templateUrl: './delete-product-modal.component.html',
  styleUrl: './delete-product-modal.component.scss'
})
export class DeleteProductModalComponent {
  @Input() productId!: number;
  @Input() productName: string = '';
  @Output() closeModal = new EventEmitter<void>();

  private productsService = inject(ProductsService);
  private translate = inject(TranslateService);

  isSubmitting = false;
  errorMsg = '';

  close(): void {
    this.closeModal.emit();
  }

  confirmDelete(): void {
    this.isSubmitting = true;
    this.errorMsg = '';
    
    this.productsService.deleteProduct(this.productId).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res?.success === false) {
          this.errorMsg = res.message || this.translate.instant('deleteProductModal.failedToDelete');
        } else {
          this.closeModal.emit();
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMsg = err.error?.message || this.translate.instant('deleteProductModal.serverError');
      }
    });
  }
}
