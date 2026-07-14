export interface CategoryDTo {
  id: number;
  name: string;
  nameAr?: string;
}

export interface Iproduct {
  id: number;
  name?: string;
  nameAr?: string;
  about?: string;
  aboutAr?: string;
  pictureUrl?: string;
  scientificName?: string;
  scientificNameAr?: string;
  forms?: string[];
  formsAr?: string[];
  activeIngredients?: string[];
  activeIngredientsAr?: string[];
  harvestSeason?: string[];
  harvestSeasonAr?: string[];
  availability?: string;
  availabilityAr?: string;
  containerCapacity?: string[];
  containerCapacityAr?: string[];
  naturalWonders?: string[];
  naturalWondersAr?: string[];
  categoryId: number;
  category?: CategoryDTo;
  // Fallbacks for older code
  categoryName?: string;
}
