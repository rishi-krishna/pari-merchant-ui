import { Component, input, output } from '@angular/core';

import { Announcement } from '../../../core/models/merchant.models';
import { AppIconComponent } from '../../app-icon.component';

@Component({
  selector: 'app-announcement-popup',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './announcement-popup.component.html',
  styleUrl: './announcement-popup.component.scss'
})
export class AnnouncementPopupComponent {
  readonly announcement = input.required<Announcement>();
  readonly visible = input(true);
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }
}
