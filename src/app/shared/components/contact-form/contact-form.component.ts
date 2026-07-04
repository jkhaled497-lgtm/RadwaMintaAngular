import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact/contact.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule,TranslateModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private readonly contactService = inject(ContactService);
  message:string = '';

  form:FormGroup = new FormGroup({
    Name: new FormControl(null,[Validators.required]),
    email: new FormControl(null,[Validators.required,Validators.email]),
    desc: new FormControl(null,[Validators.required]),
    PhoneNumber: new FormControl(null,[Validators.required])
  })
  submitForm():void{
    if (this.form.valid) {
      this.contactService.SendMessage(this.form.value).subscribe({
        next:(res)=>{
          this.message = res.message;
          this.form.reset();
          setTimeout(()=>{
            this.message = '';
          },7000)
        }
      })
    }
    else{
      this.form.markAllAsTouched();
    }
  }
}
