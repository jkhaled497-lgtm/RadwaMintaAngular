import { Component, inject, OnInit } from '@angular/core';
import { CounterDirective } from '../../directives/counter/counter.directive';
import { CounterService } from '../../../core/services/counter/counter.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-counter',
  imports: [CounterDirective,TranslateModule],
  templateUrl: './hero-counter.component.html',
  styleUrl: './hero-counter.component.scss'
})
export class HeroCounterComponent implements OnInit {
  private readonly counterService = inject(CounterService);

  isLoading:boolean = true;
  counter:number = 0;
  ngOnInit(): void {
    this.getCounter();
  }
  getCounter():void{
    this.counterService.getCounter().subscribe({
      next:(res)=>{
        this.counter = res.yearsOfExperience;
        this.isLoading = false;
      },
      error:(err)=>{
        this.isLoading = true;
      }
    });
  }
}
