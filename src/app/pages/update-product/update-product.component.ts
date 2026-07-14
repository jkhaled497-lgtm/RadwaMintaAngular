import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PRODUCT_OPTIONS } from '../../shared/constants/product-options';
import { CommonModule } from '@angular/common';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private translate = inject(TranslateService);

  productOptions = PRODUCT_OPTIONS;
  isSubmitting = false;
  errorMsg = '';
  selectedFile: File | null = null;
  activeTab = 'baseData';
  productId!: number;
  product!: Iproduct;
  currentImageUrl: string | null = null;
  isLoading = true;
  showHarvestModal = false;

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    nameAr: new FormControl('', [Validators.required]),
    about: new FormControl(''),
    aboutAr: new FormControl(''),
    scientificName: new FormControl('', [Validators.required]),
    scientificNameAr: new FormControl('', [Validators.required]),
    forms: new FormControl<string[]>([]),
    formsAr: new FormControl<string[]>([]),
    activeIngredients: new FormControl<string[]>([]),
    activeIngredientsAr: new FormControl<string[]>([]),
    harvestSeason: new FormControl<string[]>([], [Validators.required]),
    harvestSeasonAr: new FormControl<string[]>([], [Validators.required]),
    availability: new FormControl<string[]>([]),
    availabilityAr: new FormControl<string[]>([]),
    containerCapacity: new FormControl<string[]>([]),
    containerCapacityAr: new FormControl<string[]>([]),
    naturalWonders: new FormControl<string[]>([]),
    naturalWondersAr: new FormControl<string[]>([]),
    categoryId: new FormControl(0, [Validators.required, Validators.min(1)])
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.loadProduct();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadProduct(): void {
    this.productsService.getProduct(this.productId).subscribe({
      next: (res: any) => {
        this.product = res;
        this.productForm.patchValue({
          name: this.product.name || '',
          nameAr: this.product.nameAr || '',
          about: this.product.about || '',
          aboutAr: this.product.aboutAr || '',
          scientificName: this.product.scientificName || '',
          scientificNameAr: this.product.scientificNameAr || '',
          forms: this.product.forms || [],
          formsAr: this.product.formsAr || [],
          activeIngredients: this.product.activeIngredients || [],
          activeIngredientsAr: this.product.activeIngredientsAr || [],
          harvestSeason: this.product.harvestSeason || [],
          harvestSeasonAr: this.product.harvestSeasonAr || [],
          availability: Array.isArray(this.product.availability) ? this.product.availability : [],
          availabilityAr: Array.isArray(this.product.availabilityAr) ? this.product.availabilityAr : [],
          containerCapacity: this.product.containerCapacity || [],
          containerCapacityAr: this.product.containerCapacityAr || [],
          naturalWonders: this.product.naturalWonders || [],
          naturalWondersAr: this.product.naturalWondersAr || [],
          categoryId: this.product.categoryId
        });
        if (this.product.pictureUrl) {
          const baseUrl = (environment as any).imageUrl || (environment as any).FilesURL || 'https://localhost:7198/';
          this.currentImageUrl = `${baseUrl}${this.product.pictureUrl}`;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMsg = 'Failed to load product.';
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.currentImageUrl = reader.result as string;
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSelection(controlName: string, value: string) {
    const control = this.productForm.get(controlName);
    if (!control) return;

    let isSelected = false;
    const currentValues = control.value as string[] || [];
    if (currentValues.includes(value)) {
      control.setValue(currentValues.filter(v => v !== value));
      isSelected = false;
    } else {
      control.setValue([...currentValues, value]);
      isSelected = true;
    }
    control.markAsTouched();
    control.markAsDirty();

    this.syncCounterpart(controlName, value, isSelected);
  }

  syncCounterpart(controlName: string, value: string, isSelected: boolean) {
    const mapping: any = {
      forms: { counterpart: 'formsAr', sourceArr: this.productOptions.FORMS_EN, targetArr: this.productOptions.FORMS_AR },
      formsAr: { counterpart: 'forms', sourceArr: this.productOptions.FORMS_AR, targetArr: this.productOptions.FORMS_EN },
      activeIngredients: { counterpart: 'activeIngredientsAr', sourceArr: this.productOptions.ACTIVE_INGREDIENTS_EN, targetArr: this.productOptions.ACTIVE_INGREDIENTS_AR },
      activeIngredientsAr: { counterpart: 'activeIngredients', sourceArr: this.productOptions.ACTIVE_INGREDIENTS_AR, targetArr: this.productOptions.ACTIVE_INGREDIENTS_EN },
      harvestSeason: { counterpart: 'harvestSeasonAr', sourceArr: this.productOptions.HARVEST_SEASON_EN, targetArr: this.productOptions.HARVEST_SEASON_AR },
      harvestSeasonAr: { counterpart: 'harvestSeason', sourceArr: this.productOptions.HARVEST_SEASON_AR, targetArr: this.productOptions.HARVEST_SEASON_EN },
      availability: { counterpart: 'availabilityAr', sourceArr: this.productOptions.AVAILABILITY_EN, targetArr: this.productOptions.AVAILABILITY_AR },
      availabilityAr: { counterpart: 'availability', sourceArr: this.productOptions.AVAILABILITY_AR, targetArr: this.productOptions.AVAILABILITY_EN },
      containerCapacity: { counterpart: 'containerCapacityAr', sourceArr: this.productOptions.CONTAINER_CAPACITY_EN, targetArr: this.productOptions.CONTAINER_CAPACITY_AR },
      containerCapacityAr: { counterpart: 'containerCapacity', sourceArr: this.productOptions.CONTAINER_CAPACITY_AR, targetArr: this.productOptions.CONTAINER_CAPACITY_EN },
      naturalWonders: { counterpart: 'naturalWondersAr', sourceArr: this.productOptions.NATURAL_WONDERS_EN, targetArr: this.productOptions.NATURAL_WONDERS_AR },
      naturalWondersAr: { counterpart: 'naturalWonders', sourceArr: this.productOptions.NATURAL_WONDERS_AR, targetArr: this.productOptions.NATURAL_WONDERS_EN }
    };

    const map = mapping[controlName];
    if (map) {
      const idx = map.sourceArr.indexOf(value);
      if (idx !== -1 && idx < map.targetArr.length) {
        const targetValue = map.targetArr[idx];
        const targetControl = this.productForm.get(map.counterpart);
        if (targetControl) {
          const currentTargetValues = targetControl.value as string[] || [];
          if (isSelected && !currentTargetValues.includes(targetValue)) {
            targetControl.setValue([...currentTargetValues, targetValue]);
          } else if (!isSelected && currentTargetValues.includes(targetValue)) {
            targetControl.setValue(currentTargetValues.filter(v => v !== targetValue));
          }
          targetControl.markAsTouched();
          targetControl.markAsDirty();
        }
      }
    }
  }

  isSelected(controlName: string, value: string): boolean {
    const control = this.productForm.get(controlName);
    if (control) {
      const currentValues = control.value as string[] || [];
      return currentValues.includes(value);
    }
    return false;
  }

  getMetrics(optionsLength: number, controlName: string) {
    const control = this.productForm.get(controlName);
    const selectedCount = control ? (control.value as string[] || []).length : 0;
    const percentage = optionsLength ? Math.round((selectedCount / optionsLength) * 100) : 0;
    return {
      total: optionsLength,
      selected: selectedCount,
      percentage: percentage
    };
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  updateProduct() {
    const harvestValues = this.productForm.get('harvestSeason')?.value as string[] || [];
    if (harvestValues.length === 0) {
      this.showHarvestModal = true;
      return;
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.errorMsg = 'Please fill out all required fields in the Base Data tab.';
      this.activeTab = 'baseData';
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';

    const rawValue = this.productForm.getRawValue();

    const payload: any = {
      id: this.productId,
      name: rawValue.name,
      nameAr: rawValue.nameAr,
      about: rawValue.about,
      aboutAr: rawValue.aboutAr,
      scientificName: rawValue.scientificName,
      scientificNameAr: rawValue.scientificNameAr,
      categoryId: Number(rawValue.categoryId),
      forms: rawValue.forms || [],
      formsAr: rawValue.formsAr || [],
      activeIngredients: rawValue.activeIngredients || [],
      activeIngredientsAr: rawValue.activeIngredientsAr || [],
      harvestSeason: rawValue.harvestSeason || [],
      harvestSeasonAr: rawValue.harvestSeasonAr || [],
      availability: rawValue.availability || [],
      availabilityAr: rawValue.availabilityAr || [],
      containerCapacity: rawValue.containerCapacity || [],
      containerCapacityAr: rawValue.containerCapacityAr || [],
      naturalWonders: rawValue.naturalWonders || [],
      naturalWondersAr: rawValue.naturalWondersAr || []
    };

    if (this.product.pictureUrl) {
      payload.pictureUrl = this.product.pictureUrl;
    }

    const doUpdate = () => {
      this.productsService.updateProduct(this.productId, payload).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error(err);
          this.errorMsg = 'Failed to update product.';
          this.isSubmitting = false;
        }
      });
    };

    if (this.selectedFile) {
      this.productsService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          payload.pictureUrl = res.url || res.data?.url || res.data || res;
          doUpdate();
        },
        error: (err: any) => {
          console.error(err);
          this.errorMsg = 'Failed to upload image.';
          this.isSubmitting = false;
        }
      });
    } else {
      doUpdate();
    }
  }
}
