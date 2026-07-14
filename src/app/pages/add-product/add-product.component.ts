import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PRODUCT_OPTIONS } from '../../shared/constants/product-options';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private translate = inject(TranslateService);

  productOptions = PRODUCT_OPTIONS;
  isSubmitting = false;
  errorMsg = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  activeTab = 'baseData';
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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
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

  submitProduct() {
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

    if (!this.selectedFile) {
      this.errorMsg = 'Please select a product image.';
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';

    const rawValue = this.productForm.getRawValue();

    const payload: any = {
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

    const doCreate = () => {
      this.productsService.createProduct(payload).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error(err);
          this.errorMsg = 'Failed to create product.';
          this.isSubmitting = false;
        }
      });
    };

    if (this.selectedFile) {
      this.productsService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          payload.pictureUrl = res.url || res.data?.url || res.data || res;
          doCreate();
        },
        error: (err: any) => {
          console.error(err);
          this.errorMsg = 'Failed to upload image.';
          this.isSubmitting = false;
        }
      });
    } else {
      doCreate();
    }
  }
}
