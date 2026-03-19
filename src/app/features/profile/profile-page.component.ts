import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthFlowService } from '../../core/services/auth-flow.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  readonly auth = inject(AuthFlowService);
  readonly activeTab = signal<'general' | 'contact'>('general');
  readonly saving = signal(false);
  readonly saveMessage = signal('');
  readonly saveError = signal('');

  displayName = this.auth.profileName();
  email = this.auth.profileEmail();
  phone = this.auth.profilePhone();

  showTab(tab: 'general' | 'contact'): void {
    this.activeTab.set(tab);
  }

  async saveProfile(): Promise<void> {
    this.saveError.set('');
    this.saveMessage.set('');
    this.saving.set(true);

    try {
      const profile = await this.auth.updateProfile(this.displayName, this.email, this.phone);
      this.displayName = profile.displayName;
      this.email = profile.email;
      this.phone = profile.phone;
      this.saveMessage.set('Profile updated successfully.');
    } catch (error) {
      const message =
        error instanceof HttpErrorResponse
          ? error.error?.message ?? 'Unable to save profile right now.'
          : error instanceof Error
            ? error.message
            : 'Unable to save profile right now.';
      this.saveError.set(message);
    } finally {
      this.saving.set(false);
    }
  }
}
