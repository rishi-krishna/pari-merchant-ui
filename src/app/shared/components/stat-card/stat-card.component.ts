import { Component, input } from '@angular/core';

import { AppIconComponent } from '../../app-icon.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly subtitle = input('');
  readonly icon = input('wallet');
  readonly variant = input<'gold' | 'blue'>('blue');
  readonly actionLabel = input('');
}
