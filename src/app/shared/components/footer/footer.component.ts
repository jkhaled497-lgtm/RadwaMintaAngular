import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MediaService } from '../../../core/services/media/media.service';
import { MediaLinks } from '../../interfaces/media-links';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLinkActive,RouterLink,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  private readonly mediaService = inject(MediaService);
  isLoading:boolean = true; 
  mediaLinks:MediaLinks = {
    facebook: '',
    whatsApp: '',
    instagram: '',
    youtube: '',
    x: '',
    pinterest: '',
    linkedIn: '',
  };
  ngOnInit(): void {
    this.getMediaLinks();
  }
  getMediaLinks():void{
    this.mediaService.getMediaLinks().subscribe({
      next:(res: any)=>{
        this.mediaLinks = res;
          this.isLoading = false;
      },
      error:(err)=>{
        this.isLoading = true;

      }
    });
  }
}
