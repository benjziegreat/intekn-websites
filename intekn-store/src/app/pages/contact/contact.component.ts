import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  form: FormGroup;
  loading = false;
  success = false;
  error = '';

  constructor(private fb: FormBuilder, private contentService: ContentService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { error } = await this.contentService.submitContactMessage(this.form.value);
    this.loading = false;
    if (error) {
      this.error = 'Failed to send message. Please try again.';
    } else {
      this.success = true;
      this.form.reset();
    }
  }
}
