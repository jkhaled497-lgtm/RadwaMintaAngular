import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { ReviewService } from '../../../core/services/review/review.service';
import { Ireview } from '../../interfaces/ireview';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews-section',
  imports: [CarouselModule,TranslateModule,FormsModule],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss'
})
export class ReviewsSectionComponent implements OnInit{
  errorMsg:boolean = false;
  successMsg:boolean = false;
  isLoading:boolean = true;
  private readonly reviewService = inject(ReviewService);
  allReviews:Ireview[] = []; 
  showRatingPopup: boolean = false;
  selectedRating: number = 0;
    ratingForm = {
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    description: '',
    rating: 0
  };
  ngOnInit(): void {
    this.getAllReviews();
  }

  getAllReviews():void{
    this.reviewService.GetAllReviews().subscribe({
      next:(res)=>{
        this.allReviews = res;
        this.isLoading =false;
      }
    })
  }


  customOptions: OwlOptions = {
    // rtl: true,
    rtl: document.dir === 'rtl',
    loop: true, 
    autoplay:true,
    autoplayTimeout: 4000,
    nav: true,
    dots: false,
    margin: 16,
    autoplayHoverPause: true,
    navText: [
      '<span class="bg-green-500 hover:bg-green-600  w-10 h-10 rounded-full flex items-center justify-center "><i class="fa-solid fa-chevron-right"></i></span>',
      '<span class="bg-green-500 hover:bg-green-600  w-10 h-10 rounded-full flex items-center justify-center "><i class="fa-solid fa-chevron-left"></i></span>'
    ],
    responsive: {
      0: { items: 1 },
      640: { items: 2 },
      1024: { items: 3 }
    },
  };
  getStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }



  openRatingPopup(): void {
  this.showRatingPopup = true;
}
  closeRatingPopup(): void {
    this.showRatingPopup = false;
    this.resetForm();
  }
  setRating(rating: number): void {
    this.selectedRating = rating;
    this.ratingForm.rating = rating;
  }

  submitRating(): void {
    if (this.ratingForm.description =='' ||this.ratingForm.firstName ==''||this.ratingForm.lastName==''||this.ratingForm.jobTitle==''||this.ratingForm.email=='') {
      this.errorMsg= true;
      setTimeout(() => {
      this.errorMsg= false;
      }, 5000);
    }
    else{
      this.reviewService.AddReview(this.ratingForm).subscribe({
        next:(res)=>{
          this.resetForm();
          this.getAllReviews();
          this.successMsg = true;
          setTimeout(()=>{
          this.successMsg = false;
          },5000)
        },
      })
    }
  }

  resetForm(): void {
    this.selectedRating = 0;
    this.ratingForm = {
      firstName: '',
      lastName: '',
      jobTitle: '',
      email: '',
      description: '',
      rating: 0
    };
  }
}
